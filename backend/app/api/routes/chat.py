"""
Chat routes.

POST   /api/chat/message              — send a message, receive SSE stream
GET    /api/chat/history/{session_id} — fetch full conversation history
DELETE /api/chat/session/{session_id} — clear session (messages + artifacts)
GET    /api/chat/modes                — list available prompt modes
"""

import json
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.schemas import (
    ChatRequest,
    HistoryResponse,
    Message,
    SessionDeleteResponse,
)
from app.services.ai_service import ai_service
from app.services.artifact_service import artifact_service
from app.services.prompt_service import prompt_service
from app.services.search_service import search_service
from app.services.session_service import session_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message")
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """
    Inference composition order:
      1. system prompt   — resolved by mode from PromptService
      2. artifact turns  — synthetic exchange injected before history (if any files uploaded)
      3. history turns   — real user/assistant turns from DB
      4. new user turn   — request.message
    """
    try:
        system_prompt = prompt_service.get(request.mode)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    history = await session_service.get_history(db, request.session_id)
    await session_service.append_message(
        db, request.session_id, Message(role="user", content=request.message)
    )

    # Fetch artifacts and convert to plain dicts — keeps AIService decoupled from ORM
    db_artifacts = await artifact_service.get_for_session(db, request.session_id)
    artifacts = [
        {
            "filename": a.filename,
            "content_type": a.content_type,
            "raw_content": a.raw_content,
        }
        for a in db_artifacts
    ] or None

    # Build time context — injected into every response
    now_utc     = datetime.now(ZoneInfo("UTC"))
    now_est     = datetime.now(ZoneInfo("America/New_York"))
    now_pst     = datetime.now(ZoneInfo("America/Los_Angeles"))
    time_context = (
        f"\n\n## Current date & time (server)\n"
        f"- UTC:  {now_utc.strftime('%A, %B %d, %Y %I:%M %p %Z')}\n"
        f"- EST/EDT: {now_est.strftime('%A, %B %d, %Y %I:%M %p %Z')}\n"
        f"- PST/PDT: {now_pst.strftime('%A, %B %d, %Y %I:%M %p %Z')}\n"
        f"You always know the current date and time from the above. "
        f"Answer time questions directly without saying you lack real-time access."
    )

    async def event_generator():
        full_response: list[str] = []
        try:
            # Real-time web search (when enabled)
            print(f"[chat] use_search={request.use_search} message={request.message[:60]!r}", flush=True)
            search_context: str | None = None
            if request.use_search:
                yield f"data: {json.dumps({'type': 'searching'})}\n\n"
                search_context = await search_service.search(request.message)

            async for chunk in ai_service.stream_response(
                history=history,
                user_message=request.message,
                system_prompt=system_prompt.content + time_context,
                artifacts=artifacts,
                search_context=search_context,
            ):
                full_response.append(chunk)
                payload = json.dumps({"type": "chunk", "content": chunk})
                yield f"data: {payload}\n\n"

            await session_service.append_message(
                db,
                request.session_id,
                Message(role="assistant", content="".join(full_response)),
            )
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as exc:  # noqa: BLE001
            payload = json.dumps({"type": "error", "content": str(exc)})
            yield f"data: {payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/history/{session_id}", response_model=HistoryResponse)
async def get_history(
    session_id: str,
    db: AsyncSession = Depends(get_db),
) -> HistoryResponse:
    messages = await session_service.get_history(db, session_id)
    return HistoryResponse(session_id=session_id, messages=messages)


@router.delete("/session/{session_id}", response_model=SessionDeleteResponse)
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
) -> SessionDeleteResponse:
    deleted = await session_service.delete_session(db, session_id)
    await artifact_service.delete_for_session(db, session_id)  # clean up uploads too
    return SessionDeleteResponse(session_id=session_id, deleted=deleted)


@router.get("/modes")
async def list_modes() -> dict:
    return {
        "modes": [
            {"mode": prompt_service.get(m).mode, "title": prompt_service.get(m).title}
            for m in prompt_service.available_modes
        ]
    }

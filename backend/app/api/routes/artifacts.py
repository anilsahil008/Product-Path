"""
Artifact routes.

POST /api/artifacts/upload/{session_id} — upload a CSV / JSON / TXT file
GET  /api/artifacts/{session_id}        — list files stored for a session
DELETE /api/artifacts/{session_id}      — delete all files for a session
"""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.artifact_service import artifact_service

router = APIRouter(prefix="/api/artifacts", tags=["artifacts"])

_ALLOWED_EXTENSIONS = {"csv", "json", "txt"}
_MAX_BYTES = 100_000  # 100 KB — enforced before decoding


@router.post("/upload/{session_id}")
async def upload_file(
    session_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) -> dict:
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "txt"

    if ext not in _ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Allowed: csv, json, txt",
        )

    raw_bytes = await file.read()

    if len(raw_bytes) > _MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File too large — maximum 100 KB per upload",
        )

    try:
        raw_content = raw_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=400,
            detail="File must be UTF-8 encoded text",
        ) from exc

    artifact = await artifact_service.store(
        db=db,
        session_id=session_id,
        filename=filename,
        content_type=ext,
        raw_content=raw_content,
    )

    return {
        "artifact_id": artifact.id,
        "filename": artifact.filename,
        "content_type": artifact.content_type,
        "size_chars": len(raw_content),
    }


@router.get("/{session_id}")
async def list_artifacts(
    session_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    artifacts = await artifact_service.get_for_session(db, session_id)
    return {
        "session_id": session_id,
        "artifacts": [
            {
                "artifact_id": a.id,
                "filename": a.filename,
                "content_type": a.content_type,
                "created_at": a.created_at.isoformat(),
            }
            for a in artifacts
        ],
    }


@router.delete("/{session_id}")
async def delete_artifacts(
    session_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    await artifact_service.delete_for_session(db, session_id)
    return {"session_id": session_id, "deleted": True}

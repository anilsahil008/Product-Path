"""
DB-backed session service.

Public interface is intentionally identical to the old in-memory version
(same method names, same return types) so the route layer needed minimal
changes — only `db` was added as a parameter to every call.
"""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import MessageRecord
from app.models.schemas import Message


class SessionService:

    async def get_history(self, db: AsyncSession, session_id: str) -> list[Message]:
        result = await db.execute(
            select(MessageRecord)
            .where(MessageRecord.session_id == session_id)
            .order_by(MessageRecord.created_at)
        )
        return [
            Message(role=row.role, content=row.content)
            for row in result.scalars().all()
        ]

    async def append_message(
        self,
        db: AsyncSession,
        session_id: str,
        message: Message,
    ) -> None:
        db.add(MessageRecord(
            session_id=session_id,
            role=message.role,
            content=message.content,
        ))
        await db.commit()

    async def delete_session(self, db: AsyncSession, session_id: str) -> bool:
        result = await db.execute(
            delete(MessageRecord).where(MessageRecord.session_id == session_id)
        )
        await db.commit()
        return result.rowcount > 0


session_service = SessionService()

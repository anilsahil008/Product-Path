"""
Artifact service — stores and retrieves session-scoped data uploads.

Design decisions:
- Raw content stored as text, not parsed. Parsing belongs to the LLM.
- 50 KB cap per artifact (enforced here, not at the route layer) so a single
  large file can't silently crowd out conversation history in the context window.
- No per-session artifact limit for now — the injection layer truncates at 3 000
  chars per artifact when building the LLM context, so volume is self-limiting.
"""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import DataArtifact

_MAX_CONTENT_CHARS = 50_000  # ~12 500 tokens — hard cap before storing


class ArtifactService:

    async def store(
        self,
        db: AsyncSession,
        session_id: str,
        filename: str,
        content_type: str,
        raw_content: str,
    ) -> DataArtifact:
        if len(raw_content) > _MAX_CONTENT_CHARS:
            raw_content = (
                raw_content[:_MAX_CONTENT_CHARS]
                + "\n[file truncated — exceeded 50 KB storage limit]"
            )

        artifact = DataArtifact(
            session_id=session_id,
            filename=filename,
            content_type=content_type,
            raw_content=raw_content,
        )
        db.add(artifact)
        await db.commit()
        await db.refresh(artifact)
        return artifact

    async def get_for_session(
        self, db: AsyncSession, session_id: str
    ) -> list[DataArtifact]:
        result = await db.execute(
            select(DataArtifact)
            .where(DataArtifact.session_id == session_id)
            .order_by(DataArtifact.created_at)
        )
        return list(result.scalars().all())

    async def delete_for_session(self, db: AsyncSession, session_id: str) -> None:
        await db.execute(
            delete(DataArtifact).where(DataArtifact.session_id == session_id)
        )
        await db.commit()


artifact_service = ArtifactService()

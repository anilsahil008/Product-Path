"""
AI service — wraps the OpenAI SDK.

Responsibilities (and only these):
  1. Build the messages array: system prompt → artifact context → history → new turn
  2. Call the OpenAI API and stream the reply
  3. Yield raw text chunks back to the caller

Artifact injection strategy:
  Artifacts are injected as a synthetic exchange BEFORE the real conversation
  history. The model sees:

    system: [PM prompt]
    user:   "I'm sharing this data: [artifact content]"   ← synthetic
    asst:   "Got it, I'll use this..."                     ← synthetic
    user:   [first real message]
    asst:   [first real reply]
    ...
    user:   [current message]

  This avoids polluting the system prompt with session-specific data and keeps
  the data visible throughout the conversation window.

  Per-artifact injection is capped at 3 000 chars (~750 tokens) to stay within
  a reasonable token budget regardless of stored file size.
"""

from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from app.core.config import settings
from app.models.schemas import Message

_ARTIFACT_INJECT_LIMIT = 3_000  # chars per artifact when building context


class AIService:
    def __init__(self) -> None:
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def stream_response(
        self,
        history: list[Message],
        user_message: str,
        system_prompt: str,
        artifacts: list[dict] | None = None,
        search_context: str | None = None,
        time_context: str | None = None,
    ) -> AsyncGenerator[str, None]:
        """
        Args:
            history:        Prior user/assistant turns (not including current message).
            user_message:   The new user turn being responded to.
            system_prompt:  Injected as the OpenAI system role message.
            artifacts:      Optional list of {filename, content_type, raw_content} dicts.
                            Injected as a synthetic early exchange before history.
            search_context: Optional real-time web search results appended to system prompt.
            time_context:   Current server datetime — injected last so it overrides search results.
        """
        full_system = system_prompt
        if search_context:
            full_system += "\n\n" + search_context
        if time_context:
            full_system += time_context

        messages: list[dict] = [{"role": "system", "content": full_system}]

        # Inject data artifacts as synthetic opening exchange
        if artifacts:
            messages.append({
                "role": "user",
                "content": self._build_artifact_context(artifacts),
            })
            messages.append({
                "role": "assistant",
                "content": (
                    "I've reviewed the data you've shared. "
                    "I'm ready to help you interpret it from a PM perspective — "
                    "what would you like to understand?"
                ),
            })

        # Real conversation history
        messages += [{"role": m.role, "content": m.content} for m in history]
        messages.append({"role": "user", "content": user_message})

        stream = await self._client.chat.completions.create(
            model=settings.model,
            max_tokens=settings.max_tokens,
            messages=messages,
            stream=True,
        )

        async for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                yield text

    def _build_artifact_context(self, artifacts: list[dict]) -> str:
        parts = ["I'm sharing the following data for analysis:\n"]
        for a in artifacts:
            content = a["raw_content"]
            if len(content) > _ARTIFACT_INJECT_LIMIT:
                content = (
                    content[:_ARTIFACT_INJECT_LIMIT]
                    + "\n... [truncated for context — full file stored]"
                )
            parts.append(f"**{a['filename']}** ({a['content_type']}):\n```\n{content}\n```")
        return "\n\n".join(parts)


# Singleton — one shared client, one connection pool
ai_service = AIService()

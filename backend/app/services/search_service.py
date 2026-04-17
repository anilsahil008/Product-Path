"""
Search service — wraps Tavily for real-time web search.

Injected as additional context before the AI response when the user
enables Live Search mode. Keeps AIService decoupled from search logic.
"""

from __future__ import annotations

from app.core.config import settings

_MAX_RESULTS   = 4
_CONTENT_LIMIT = 600  # chars per result to stay within token budget


class SearchService:
    def __init__(self) -> None:
        self._client = None

    def _get_client(self):
        if self._client is None:
            if not settings.tavily_api_key:
                return None
            from tavily import AsyncTavilyClient
            self._client = AsyncTavilyClient(api_key=settings.tavily_api_key)
        return self._client

    async def search(self, query: str) -> str | None:
        """
        Search the web and return a formatted context string, or None if
        search is unavailable or fails.
        """
        client = self._get_client()
        if client is None:
            return None

        try:
            response = await client.search(
                query,
                max_results=_MAX_RESULTS,
                search_depth="basic",
                include_answer=True,
            )

            parts: list[str] = []

            # Top-level answer summary (when available)
            if response.get("answer"):
                parts.append(f"**Search summary:** {response['answer']}")

            # Individual result snippets
            for r in response.get("results", [])[:_MAX_RESULTS]:
                content = (r.get("content") or "").strip()
                if len(content) > _CONTENT_LIMIT:
                    content = content[:_CONTENT_LIMIT] + "…"
                url   = r.get("url", "")
                title = r.get("title", url)
                if content:
                    parts.append(f"**{title}** ({url})\n{content}")

            if not parts:
                return None

            return (
                "## Real-time web search results\n\n"
                + "\n\n---\n\n".join(parts)
                + "\n\n---\n\n"
                "Use the above search results to inform your answer where relevant. "
                "Cite sources when you reference specific information from them."
            )

        except Exception:
            return None


search_service = SearchService()

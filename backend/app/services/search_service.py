"""
Search service — wraps Tavily for real-time web search.

Uses the sync TavilyClient via asyncio.to_thread to avoid AsyncTavilyClient
version compatibility issues. Errors are logged to stdout so they appear
in Render logs.
"""

from __future__ import annotations

import asyncio
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

_MAX_RESULTS   = 4
_CONTENT_LIMIT = 600  # chars per result to stay within token budget


def _do_search(query: str) -> dict:
    """Sync Tavily call — runs in a thread pool via asyncio.to_thread."""
    from tavily import TavilyClient
    client = TavilyClient(api_key=settings.tavily_api_key.strip())
    return client.search(
        query,
        max_results=_MAX_RESULTS,
        search_depth="basic",
        include_answer=True,
    )


class SearchService:

    async def search(self, query: str) -> str | None:
        """
        Search the web and return a formatted context string, or None if
        search is unavailable or fails.
        """
        if not settings.tavily_api_key:
            logger.warning("TAVILY_API_KEY not set — skipping web search")
            return None

        try:
            response = await asyncio.to_thread(_do_search, query)

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
                logger.warning("Tavily returned no results for query: %s", query)
                return None

            logger.info("Tavily search succeeded — %d results for: %s", len(parts), query)

            return (
                "## Real-time web search results\n\n"
                + "\n\n---\n\n".join(parts)
                + "\n\n---\n\n"
                "Use the above search results to inform your answer where relevant. "
                "Cite sources when you reference specific information from them."
            )

        except Exception as exc:
            logger.error("Tavily search failed: %s", exc)
            return None


search_service = SearchService()

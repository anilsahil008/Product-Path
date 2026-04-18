"""
Image service — GPT-4o image generation (gpt-image-1) with DALL-E 3 fallback.

Three improvements over the naive approach:
  1. PM visual type detection → pre-built style templates per diagram type
  2. Conversation history injected into prompt for product-specific context
  3. gpt-image-1 model (same as ChatGPT) → falls back to dall-e-3 if unavailable
"""

from openai import AsyncOpenAI
from app.core.config import settings

# ── Image request detection ───────────────────────────────────────────────────

_IMAGE_TRIGGERS = [
    "generate an image", "create an image", "make an image",
    "draw a ", "draw an ", "generate a picture", "create a picture",
    "make a picture", "generate image of", "create image of",
    "show me an image", "generate a visual", "create a visual",
    "design an image", "illustrate ", "generate a diagram",
    "create a diagram", "make a diagram",
]


def is_image_request(message: str) -> bool:
    lower = message.lower()
    return any(t in lower for t in _IMAGE_TRIGGERS)


# ── PM visual type templates ──────────────────────────────────────────────────
# Pre-built style descriptions for each PM diagram type.
# These guide DALL-E/GPT toward professional, readable output.

_PM_TEMPLATES: dict[str, str] = {
    "roadmap": (
        "A professional product roadmap infographic. Horizontal timeline divided into "
        "Q1, Q2, Q3, Q4 columns. Each quarter contains 2–3 feature items as colored "
        "pill-shaped labels. Color-coded swim lanes for different product areas. "
        "Clean white background, modern flat design, indigo/blue/teal color palette. "
        "Bold column headers, small readable labels. Business presentation quality."
    ),
    "sprint": (
        "A professional Agile sprint board / kanban board infographic. "
        "Four columns: Backlog, In Progress, In Review, Done. "
        "Colored task cards in each column showing story points. "
        "Dark header row, white card bodies, status color-coding. "
        "Clean modern flat design, business presentation quality."
    ),
    "user journey": (
        "A professional user journey map diagram. Horizontal stages: "
        "Awareness, Consideration, Decision, Onboarding, Retention. "
        "Each stage has rows for: user actions, emotions (emoji scale), "
        "pain points, and opportunities. Clean grid layout, indigo headers, "
        "white background, color-coded rows, business presentation quality."
    ),
    "okr": (
        "A professional OKR (Objectives and Key Results) framework diagram. "
        "3 objective cards, each with 3–4 numbered key results below it. "
        "Progress bars showing % completion next to each key result. "
        "Color-coded by objective, clear hierarchy, modern flat design. "
        "Dark card backgrounds with light text, business presentation quality."
    ),
    "metrics": (
        "A professional product metrics / KPI dashboard infographic. "
        "Grid of metric cards showing: DAU, Retention Rate, Conversion Rate, NPS. "
        "Each card has a large metric number, trend arrow, and small sparkline. "
        "Teal/green for positive trends, red for negative. "
        "Dark dashboard theme, modern flat design, business presentation quality."
    ),
    "prioritization": (
        "A professional 2×2 product prioritization matrix. "
        "X-axis: Effort (Low → High). Y-axis: Impact (Low → High). "
        "Feature names plotted as labeled circles in their quadrants. "
        "Quadrant labels: Quick Wins, Big Bets, Fill-ins, Avoid. "
        "Clean white background, indigo/blue accent colors, modern flat design."
    ),
    "user story": (
        "A professional user story map infographic. "
        "Top row: user activities (swim lanes). Middle row: user tasks per activity. "
        "Bottom rows: sprint slices grouping stories by release. "
        "Color-coded by sprint, sticky-note style cards, horizontal layout. "
        "Clean white background, modern flat design, business presentation quality."
    ),
    "gtm": (
        "A professional Go-To-Market strategy diagram. "
        "Sections: Target Segment, Value Proposition, Channels, Pricing, Launch Timeline. "
        "Clean infographic layout with icons for each section. "
        "Indigo/teal color scheme, white background, modern flat design. "
        "Business presentation quality, clear readable labels."
    ),
}


def _detect_visual_type(message: str) -> str | None:
    lower = message.lower()
    for key in _PM_TEMPLATES:
        if key in lower:
            return key
    return None


# ── Prompt builder ────────────────────────────────────────────────────────────

_GENERIC_SYSTEM = (
    "You are an expert at writing image generation prompts for professional product "
    "management visuals. Convert the user's request into a detailed DALL-E prompt. "
    "Always specify: clean infographic or diagram style, flat design, professional "
    "business presentation quality, modern color scheme (blues, purples, teals, "
    "white or light background), clear readable labels, organized layout. "
    "Never include: photos of people, abstract art, cluttered designs. "
    "Return only the image prompt, nothing else."
)


def _recent_context(history: list) -> str:
    """Extract a short summary of recent conversation for image context."""
    if not history:
        return ""
    snippets = []
    for m in history[-6:]:
        role = "User" if m.role == "user" else "Assistant"
        text = m.content[:150].replace("\n", " ")
        snippets.append(f"{role}: {text}")
    return " | ".join(snippets)


# ── Service ───────────────────────────────────────────────────────────────────

class ImageService:
    def __init__(self) -> None:
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def _build_prompt(self, user_message: str, history: list) -> str:
        """
        Build an optimized image prompt:
        - If we recognise the PM visual type, start from our template.
        - Always call GPT-4o-mini to inject product-specific context from history.
        """
        visual_type = _detect_visual_type(user_message)
        context = _recent_context(history)

        if visual_type:
            base = _PM_TEMPLATES[visual_type]
            system = (
                "You are an expert at refining DALL-E image prompts. "
                "Start from the provided base style, then personalise it using "
                "any product/feature context from the conversation. "
                "Keep the style spec intact — only add specific names, features, "
                "or details from the context. Return only the final prompt."
            )
            user_content = (
                f"Base style:\n{base}\n\n"
                f"User request: {user_message}\n\n"
                + (f"Conversation context:\n{context}" if context else "")
            )
        else:
            system = _GENERIC_SYSTEM
            user_content = (
                f"User request: {user_message}\n\n"
                + (f"Conversation context:\n{context}" if context else "")
            )

        response = await self._client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": user_content},
            ],
            max_tokens=400,
        )
        return response.choices[0].message.content.strip()

    async def generate(self, user_message: str, history: list | None = None) -> str:
        """
        Generate an image and return either a data URI (gpt-image-1)
        or a CDN URL (dall-e-3 fallback).
        """
        optimized_prompt = await self._build_prompt(user_message, history or [])

        # Try gpt-image-1 first (same model ChatGPT uses)
        try:
            response = await self._client.images.generate(
                model="gpt-image-1",
                prompt=optimized_prompt,
                size="1024x1024",
                quality="high",
                n=1,
            )
            b64 = response.data[0].b64_json
            if b64:
                return f"data:image/png;base64,{b64}"
        except Exception:
            pass  # Model not available on this account — fall through

        # DALL-E 3 fallback
        response = await self._client.images.generate(
            model="dall-e-3",
            prompt=optimized_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url


image_service = ImageService()

"""
Image service — wraps OpenAI DALL-E 3 for image generation.

Uses GPT-4o-mini to first convert the user's request into an optimized
DALL-E prompt that produces clean, professional PM infographics — the same
technique ChatGPT uses internally for better image quality.
"""

from openai import AsyncOpenAI
from app.core.config import settings

_IMAGE_TRIGGERS = [
    "generate an image", "create an image", "make an image",
    "draw a ", "draw an ", "generate a picture", "create a picture",
    "make a picture", "generate image of", "create image of",
    "show me an image", "generate a visual", "create a visual",
    "design an image", "illustrate ", "generate a diagram",
    "create a diagram", "make a diagram",
]

_PROMPT_SYSTEM = (
    "You are an expert at writing DALL-E 3 prompts for professional product management visuals. "
    "Convert the user's request into a detailed, specific DALL-E prompt. "
    "Always produce: clean infographic or diagram style, flat design, professional business "
    "presentation quality, modern color scheme (blues, purples, teals, white backgrounds), "
    "clear readable labels, organized layout. "
    "Never: photos of people, abstract art, cluttered designs, or artistic illustrations. "
    "Return only the DALL-E prompt text, nothing else."
)


def is_image_request(message: str) -> bool:
    lower = message.lower()
    return any(t in lower for t in _IMAGE_TRIGGERS)


class ImageService:
    def __init__(self) -> None:
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def _build_prompt(self, user_message: str) -> str:
        """Use GPT-4o-mini to craft an optimized DALL-E 3 prompt."""
        response = await self._client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": _PROMPT_SYSTEM},
                {"role": "user", "content": user_message},
            ],
            max_tokens=300,
        )
        return response.choices[0].message.content.strip()

    async def generate(self, user_message: str) -> str:
        """Build an optimized prompt then generate an image with DALL-E 3."""
        optimized_prompt = await self._build_prompt(user_message)
        response = await self._client.images.generate(
            model="dall-e-3",
            prompt=optimized_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url


image_service = ImageService()

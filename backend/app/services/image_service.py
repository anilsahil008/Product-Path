"""
Image service — wraps OpenAI DALL-E 3 for image generation.
Uses the same OpenAI client already configured for chat.
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


def is_image_request(message: str) -> bool:
    lower = message.lower()
    return any(t in lower for t in _IMAGE_TRIGGERS)


class ImageService:
    def __init__(self) -> None:
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate(self, prompt: str) -> str:
        """Generate an image with DALL-E 3 and return the URL."""
        response = await self._client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url


image_service = ImageService()

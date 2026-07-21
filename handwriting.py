import base64
import logging
from mistral_client import get_client

logger = logging.getLogger(__name__)

HANDWRITING_PROMPT = """You are an expert handwriting recognition specialist.
Please carefully transcribe all handwritten text in this document image.
Preserve the original structure, line breaks, and formatting as much as possible.
If any part is illegible, indicate it with [illegible].
Return only the transcribed text."""


async def extract_handwriting(file_bytes: bytes, filename: str) -> str:
    """
    Uses Pixtral vision model directly to transcribe handwriting from image bytes.
    """
    client = get_client()

    # Determine media type from filename
    ext = filename.rsplit(".", 1)[-1].lower()
    media_type_map = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "tiff": "image/tiff",
        "pdf": "image/jpeg",  # fallback; PDFs handled differently if needed
    }
    media_type = media_type_map.get(ext, "image/jpeg")

    # Encode image as base64
    image_b64 = base64.b64encode(file_bytes).decode("utf-8")
    image_url = f"data:{media_type};base64,{image_b64}"

    response = client.chat.complete(
        model="pixtral-12b-2409",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url},
                    },
                    {
                        "type": "text",
                        "text": HANDWRITING_PROMPT,
                    },
                ],
            }
        ],
    )

    result = response.choices[0].message.content
    logger.info("Handwriting extraction completed.")
    return result

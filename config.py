import os
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
MAX_FILE_SIZE: int = 20 * 1024 * 1024  # 20MB
ALLOWED_TYPES: list[str] = ["pdf", "png", "jpg", "jpeg", "tiff"]

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY is not set in environment variables")

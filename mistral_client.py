from mistralai import Mistral
from config import MISTRAL_API_KEY

_client: Mistral | None = None


def get_client() -> Mistral:
    global _client
    if _client is None:
        _client = Mistral(api_key=MISTRAL_API_KEY)
    return _client

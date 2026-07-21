import json
import logging
from mistral_client import get_client
from schemas.contract import ContractSchema

logger = logging.getLogger(__name__)

CONTRACT_PROMPT = """You are an expert legal document analyst.
Given the following OCR text from a contract, extract all relevant information and return it as a JSON object.

OCR Text:
{ocr_text}

Extract and return a JSON object with this exact structure:
{{
  "parties": [
    {{
      "name": "string",
      "role": "string (e.g. Client, Vendor, Employer, Employee)",
      "address": "string or null"
    }}
  ],
  "effective_date": "string or null - contract start date",
  "expiration_date": "string or null - contract end date",
  "termination_clause": "string or null - summary of termination conditions",
  "payment_terms": "string or null - payment schedule or terms",
  "governing_law": "string or null - jurisdiction or governing law",
  "key_obligations": ["string - list of key obligations or deliverables"]
}}

Return ONLY the JSON object, no explanation or markdown."""


async def extract_contract_json(ocr_text: str) -> ContractSchema:
    client = get_client()
    prompt = CONTRACT_PROMPT.format(ocr_text=ocr_text)

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)
    return ContractSchema(**data)

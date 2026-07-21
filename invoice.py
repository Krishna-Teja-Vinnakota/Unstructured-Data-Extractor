import json
import logging
from mistral_client import get_client
from schemas.invoice import InvoiceSchema

logger = logging.getLogger(__name__)

INVOICE_PROMPT = """You are an expert invoice data extractor.
Given the following OCR text from an invoice document, extract all relevant information and return it as a JSON object.

OCR Text:
{ocr_text}

Extract and return a JSON object with this exact structure:
{{
  "vendor": "string - company or person issuing the invoice",
  "invoice_number": "string - invoice ID or number",
  "invoice_date": "string - date invoice was issued (ISO format if possible)",
  "due_date": "string or null - payment due date",
  "total_amount": number or null,
  "tax_amount": number or null,
  "currency": "string - currency code (e.g. USD, EUR)",
  "line_items": [
    {{
      "description": "string",
      "quantity": number or null,
      "price": number or null,
      "unit": "string or null"
    }}
  ]
}}

Return ONLY the JSON object, no explanation or markdown."""


async def extract_invoice_json(ocr_text: str) -> InvoiceSchema:
    client = get_client()
    prompt = INVOICE_PROMPT.format(ocr_text=ocr_text)

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)
    return InvoiceSchema(**data)

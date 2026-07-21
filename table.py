import json
import logging
from mistral_client import get_client
from schemas.table import TableSchema

logger = logging.getLogger(__name__)

TABLE_PROMPT = """You are an expert data extraction specialist.
Given the following OCR text containing one or more tables, extract the table data and return it as a JSON object.

OCR Text:
{ocr_text}

Extract and return a JSON object with this exact structure:
{{
  "title": "string or null - table title if present",
  "columns": ["string - column header names"],
  "rows": [
    ["string - cell value for each column"]
  ],
  "summary": "string or null - brief summary of what the table contains"
}}

Each inner array in 'rows' should have the same number of elements as 'columns'.
Return ONLY the JSON object, no explanation or markdown."""


async def extract_table_json(ocr_text: str) -> TableSchema:
    client = get_client()
    prompt = TABLE_PROMPT.format(ocr_text=ocr_text)

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)
    return TableSchema(**data)

import time
import logging
from processors.ocr import run_ocr
from processors.extractors.invoice import extract_invoice_json
from processors.extractors.contract import extract_contract_json
from processors.extractors.table import extract_table_json
from processors.extractors.handwriting import extract_handwriting

logger = logging.getLogger(__name__)


class DocumentPipeline:
    def __init__(self, doc_type: str, output_format: str):
        self.doc_type = doc_type
        self.output_format = output_format

    async def run(self, file_bytes: bytes, filename: str) -> dict:
        start = time.time()

        try:
            result = await self._process(file_bytes, filename)
        except Exception as e:
            logger.error(f"Pipeline error: {e}")
            raise

        elapsed_ms = int((time.time() - start) * 1000)
        return {
            "success": True,
            "doc_type": self.doc_type,
            "output_format": self.output_format,
            "result": result,
            "processing_time_ms": elapsed_ms,
        }

    async def _process(self, file_bytes: bytes, filename: str):
        # Handwriting always uses vision model directly
        if self.doc_type == "handwriting":
            text = await extract_handwriting(file_bytes, filename)
            if self.output_format == "json":
                return {"transcription": text}
            return text

        # All other types: run OCR first
        ocr_text = await run_ocr(file_bytes, filename)

        if self.output_format == "ocr":
            return ocr_text

        if self.output_format == "json":
            return await self._extract_json(ocr_text)

        if self.output_format == "raw":
            schema = await self._extract_json(ocr_text)
            if hasattr(schema, "model_dump"):
                return schema.model_dump()
            return schema

        return ocr_text

    async def _extract_json(self, ocr_text: str):
        if self.doc_type == "invoice":
            return await extract_invoice_json(ocr_text)
        elif self.doc_type == "contract":
            return await extract_contract_json(ocr_text)
        elif self.doc_type == "table":
            return await extract_table_json(ocr_text)
        else:
            return {"text": ocr_text}

import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from config import MAX_FILE_SIZE, ALLOWED_TYPES
from processors.pipeline import DocumentPipeline

logger = logging.getLogger(__name__)
router = APIRouter()

VALID_DOC_TYPES = {"contract", "table", "invoice", "handwriting"}
VALID_OUTPUT_FORMATS = {"ocr", "json", "raw"}


def _serialize_result(result):
    """Recursively convert Pydantic models and other types to JSON-safe dicts."""
    if hasattr(result, "model_dump"):
        return result.model_dump()
    if isinstance(result, dict):
        return {k: _serialize_result(v) for k, v in result.items()}
    if isinstance(result, list):
        return [_serialize_result(i) for i in result]
    return result


@router.post("/api/process")
async def process_document(
    file: UploadFile = File(...),
    doc_type: str = Form(...),
    output_format: str = Form(...),
):
    # Validate doc_type
    if doc_type not in VALID_DOC_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid doc_type '{doc_type}'. Must be one of: {', '.join(VALID_DOC_TYPES)}",
        )

    # Validate output_format
    if output_format not in VALID_OUTPUT_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid output_format '{output_format}'. Must be one of: {', '.join(VALID_OUTPUT_FORMATS)}",
        )

    # Validate file extension
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '.{ext}' is not allowed. Allowed: {', '.join(ALLOWED_TYPES)}",
        )

    # Read file bytes
    file_bytes = await file.read()

    # Validate file size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB.",
        )

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        pipeline = DocumentPipeline(doc_type=doc_type, output_format=output_format)
        response = await pipeline.run(file_bytes, filename)
        response["result"] = _serialize_result(response["result"])
        return response
    except Exception as e:
        logger.error(f"Processing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

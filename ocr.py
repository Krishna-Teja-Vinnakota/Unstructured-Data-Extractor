import logging
from mistral_client import get_client

logger = logging.getLogger(__name__)


async def run_ocr(file_bytes: bytes, filename: str) -> str:
    """
    Runs Mistral OCR on uploaded file bytes.
    Steps:
      1. Upload file to Mistral with purpose='ocr'
      2. Get signed URL for the uploaded file
      3. Run OCR via mistral-ocr-latest
      4. Delete file from Mistral servers (always)
    Returns the OCR markdown text.
    """
    client = get_client()
    uploaded_file = None

    try:
        # Step 1: Upload
        logger.info(f"Uploading file '{filename}' to Mistral for OCR...")
        uploaded_file = client.files.upload(
            file={"file_name": filename, "content": file_bytes},
            purpose="ocr",
        )
        logger.info(f"Uploaded file id: {uploaded_file.id}")

        # Step 2: Get signed URL
        signed = client.files.get_signed_url(file_id=uploaded_file.id)
        logger.info("Got signed URL.")

        # Step 3: Run OCR
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document={"type": "document_url", "document_url": signed.url},
        )

        # Collect all page markdown text
        pages_text = []
        for page in ocr_response.pages:
            pages_text.append(page.markdown)

        result = "\n\n".join(pages_text)
        logger.info("OCR completed successfully.")
        return result

    finally:
        # Step 4: Always delete uploaded file
        if uploaded_file is not None:
            try:
                client.files.delete(file_id=uploaded_file.id)
                logger.info(f"Deleted file {uploaded_file.id} from Mistral.")
            except Exception as del_err:
                logger.warning(f"Failed to delete file {uploaded_file.id}: {del_err}")

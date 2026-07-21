import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.documents import router as documents_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(
    title="Document AI API",
    description="AI-powered document processing using Mistral OCR and LLMs",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Document AI API"}

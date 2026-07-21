# DocumentAI — Mistral-powered OCR & Data Extraction

A full-stack document processing application that uses Mistral's OCR and LLM APIs to extract structured data from contracts, invoices, tables, and handwritten documents.

---

## Features

- **4 Document Types**: Contract, Table, Invoice, Handwriting
- **3 Output Formats**: OCR text, Structured JSON, Raw model dump
- **Mistral Integration**: Uses `mistral-ocr-latest`, `mistral-large-latest`, and `pixtral-12b-2409`
- **Dark UI**: Clean, minimal dark interface with orange accent
- **Async FastAPI Backend**: Fast, production-ready Python API

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- A [Mistral API key](https://console.mistral.ai/)

---

### Backend Setup

```bash
cd backend

# Copy and fill in environment variables
cp .env.example .env
# Edit .env and add your MISTRAL_API_KEY

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

---

### Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.local.example .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

### Docker Setup (both services)

```bash
# Copy backend env
cp backend/.env.example backend/.env
# Edit backend/.env and add your MISTRAL_API_KEY

# Run both services
docker-compose up --build
```

---

## Getting a Mistral API Key

1. Go to [https://console.mistral.ai/](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to **API Keys** in the sidebar
4. Create a new key and copy it
5. Paste it into `backend/.env` as `MISTRAL_API_KEY=your_key_here`

---

## API Reference

### `POST /api/process`

Process a document file and return extracted data.

**Form fields:**
| Field | Type | Values |
|-------|------|--------|
| `file` | UploadFile | PDF, PNG, JPG, JPEG, TIFF (max 20MB) |
| `doc_type` | string | `contract`, `table`, `invoice`, `handwriting` |
| `output_format` | string | `ocr`, `json`, `raw` |

**Response:**
```json
{
  "success": true,
  "doc_type": "invoice",
  "output_format": "json",
  "result": {
    "vendor": "Acme Corp",
    "invoice_number": "INV-2024-001",
    "total_amount": 1250.00,
    "currency": "USD",
    "line_items": [...]
  },
  "processing_time_ms": 2340
}
```

### `GET /health`

Returns `{ "status": "ok" }`.

---

## Example cURL

```bash
# Process an invoice as JSON
curl -X POST http://localhost:8000/api/process \
  -F "file=@invoice.pdf" \
  -F "doc_type=invoice" \
  -F "output_format=json"

# Get OCR text from a contract
curl -X POST http://localhost:8000/api/process \
  -F "file=@contract.pdf" \
  -F "doc_type=contract" \
  -F "output_format=ocr"

# Extract table data
curl -X POST http://localhost:8000/api/process \
  -F "file=@spreadsheet.png" \
  -F "doc_type=table" \
  -F "output_format=json"
```

---

## Project Structure

```
document-ai-app/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── config.py                # Config & env vars
│   ├── mistral_client.py        # Singleton Mistral client
│   ├── routers/
│   │   └── documents.py         # POST /api/process endpoint
│   ├── processors/
│   │   ├── pipeline.py          # Document processing orchestrator
│   │   ├── ocr.py               # Mistral OCR (upload → signed URL → OCR → delete)
│   │   └── extractors/
│   │       ├── invoice.py       # Invoice JSON extraction
│   │       ├── contract.py      # Contract JSON extraction
│   │       ├── table.py         # Table JSON extraction
│   │       └── handwriting.py   # Pixtral vision transcription
│   ├── schemas/
│   │   ├── invoice.py           # InvoiceSchema Pydantic model
│   │   ├── contract.py          # ContractSchema Pydantic model
│   │   └── table.py             # TableSchema Pydantic model
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Main UI
│   │   └── globals.css
│   ├── components/
│   │   ├── TypeSelector.tsx
│   │   ├── OutputSelector.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ProcessButton.tsx
│   ├── lib/api.ts               # API client
│   └── types/index.ts           # TypeScript types
│
└── docker-compose.yml
```

---

## Models Used

| Task | Model |
|------|-------|
| OCR (all types except handwriting) | `mistral-ocr-latest` |
| JSON extraction (invoice, contract, table) | `mistral-large-latest` |
| Handwriting transcription | `pixtral-12b-2409` |

---

## Screenshot

![DocumentAI Screenshot](screenshot.png)

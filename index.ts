export type DocType = "contract" | "table" | "invoice" | "handwriting";
export type OutputFormat = "ocr" | "json" | "raw";

export interface ProcessResponse {
  success: boolean;
  doc_type: DocType;
  output_format: OutputFormat;
  result: string | Record<string, unknown> | unknown;
  processing_time_ms: number;
}

export interface AppState {
  selectedDocType: DocType;
  selectedOutputFormat: OutputFormat;
  uploadedFile: File | null;
  isProcessing: boolean;
  result: ProcessResponse | null;
  error: string | null;
}

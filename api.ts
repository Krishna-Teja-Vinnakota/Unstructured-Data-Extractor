import { DocType, OutputFormat, ProcessResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function processDocument(
  file: File,
  docType: DocType,
  outputFormat: OutputFormat
): Promise<ProcessResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("doc_type", docType);
  formData.append("output_format", outputFormat);

  const response = await fetch(`${API_URL}/api/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

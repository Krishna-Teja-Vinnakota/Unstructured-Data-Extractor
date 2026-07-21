"use client";

import { useState } from "react";
import TypeSelector from "@/components/TypeSelector";
import OutputSelector from "@/components/OutputSelector";
import DocumentUpload from "@/components/DocumentUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultDisplay from "@/components/ResultDisplay";
import { processDocument } from "@/lib/api";
import { AppState } from "@/types";

const initialState: AppState = {
  selectedDocType: "invoice",
  selectedOutputFormat: "json",
  uploadedFile: null,
  isProcessing: false,
  result: null,
  error: null,
};

export default function Home() {
  const [state, setState] = useState<AppState>(initialState);

  const update = (patch: Partial<AppState>) =>
    setState((s) => ({ ...s, ...patch }));

  const handleProcess = async () => {
    if (!state.uploadedFile) return;
    update({ isProcessing: true, result: null, error: null });

    try {
      const response = await processDocument(
        state.uploadedFile,
        state.selectedDocType,
        state.selectedOutputFormat
      );
      update({ result: response, isProcessing: false });
    } catch (err: unknown) {
      update({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        isProcessing: false,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/30">
              AI
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              Document<span className="text-orange-500">AI</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-sm ml-11">
            OCR & structured extraction powered by Mistral
          </p>
        </header>

        {/* Main card */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 space-y-6 shadow-2xl">

          {/* Document Type */}
          <section>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">
              Document Type
            </label>
            <TypeSelector
              selected={state.selectedDocType}
              onChange={(t) => update({ selectedDocType: t, result: null, error: null })}
            />
          </section>

          {/* Upload */}
          <section>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">
              Upload Document
            </label>
            <DocumentUpload
              file={state.uploadedFile}
              onChange={(f) => update({ uploadedFile: f, result: null, error: null })}
            />
          </section>

          {/* Output Format */}
          <section>
            <label className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">
              Output Format
            </label>
            <OutputSelector
              selected={state.selectedOutputFormat}
              onChange={(f) => update({ selectedOutputFormat: f, result: null, error: null })}
            />
          </section>

          {/* Process button */}
          <ProcessButton
            onClick={handleProcess}
            disabled={!state.uploadedFile || state.isProcessing}
            isProcessing={state.isProcessing}
          />
        </div>

        {/* Error */}
        {state.error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-3">
            <span className="text-base flex-shrink-0">⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        {/* Result */}
        {state.result && (
          <div className="mt-4">
            <ResultDisplay result={state.result} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-zinc-700">
          Powered by{" "}
          <a
            href="https://mistral.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
          >
            Mistral AI
          </a>
        </footer>
      </div>
    </main>
  );
}

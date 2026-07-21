"use client";

import { useState } from "react";
import { ProcessResponse } from "@/types";

interface Props {
  result: ProcessResponse;
}

function JsonToken({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <div className="font-mono text-xs leading-6 overflow-x-auto">
      {lines.map((line, i) => {
        const formatted = line
          .replace(/("[\w\s]+")\s*:/g, '<span class="text-sky-400">$1</span>:')
          .replace(/:\s*(".*?")/g, ': <span class="text-emerald-400">$1</span>')
          .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span class="text-rose-400">$1</span>');
        return (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: formatted }}
            className="whitespace-pre"
          />
        );
      })}
    </div>
  );
}

export default function ResultDisplay({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text =
      typeof result.result === "string"
        ? result.result
        : JSON.stringify(result.result, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderContent = () => {
    if (result.output_format === "ocr") {
      return (
        <pre className="font-mono text-xs text-zinc-300 leading-6 whitespace-pre-wrap break-words">
          {typeof result.result === "string" ? result.result : JSON.stringify(result.result, null, 2)}
        </pre>
      );
    }

    const jsonStr = JSON.stringify(result.result, null, 2);
    return <JsonToken value={jsonStr} />;
  };

  return (
    <div className="rounded-xl border border-[#2f2f2f] bg-[#161616] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f2f2f] bg-[#1c1c1c]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Result
          </span>
          <span className="text-xs bg-[#2a2a2a] text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/20">
            {result.doc_type}
          </span>
          <span className="text-xs bg-[#2a2a2a] text-sky-400 px-2 py-0.5 rounded font-mono border border-sky-500/20">
            {result.output_format}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600 font-mono">
            {result.processing_time_ms}ms
          </span>
          <button
            onClick={handleCopy}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150
              ${copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:bg-[#333] border border-[#3a3a3a]"
              }
            `}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

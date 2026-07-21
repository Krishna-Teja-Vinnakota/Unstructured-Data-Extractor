"use client";

import { useCallback, useState } from "react";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DocumentUpload({ file, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onChange(dropped);
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
        min-h-[160px] flex flex-col items-center justify-center gap-3 p-8
        ${dragOver
          ? "border-orange-500 bg-orange-500/5"
          : file
          ? "border-emerald-500/50 bg-emerald-500/5"
          : "border-[#3a3a3a] bg-[#1e1e1e] hover:border-[#555] hover:bg-[#222]"
        }
      `}
    >
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.tiff"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {file ? (
        <div className="text-center pointer-events-none">
          <div className="text-4xl mb-2">
            {file.name.endsWith(".pdf") ? "📕" : "🖼️"}
          </div>
          <p className="text-zinc-200 font-semibold text-sm truncate max-w-[300px]">{file.name}</p>
          <p className="text-zinc-500 text-xs mt-1">{formatBytes(file.size)}</p>
          <button
            className="mt-3 text-xs text-zinc-400 hover:text-red-400 transition-colors pointer-events-auto z-10 relative"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className="text-center pointer-events-none">
          <div className="text-4xl mb-3 opacity-40">
            {dragOver ? "📂" : "📁"}
          </div>
          <p className="text-zinc-300 font-semibold text-sm">
            {dragOver ? "Drop it here" : "Drag & drop your document"}
          </p>
          <p className="text-zinc-500 text-xs mt-1.5">
            or <span className="text-orange-400 underline underline-offset-2">click to browse</span>
          </p>
          <p className="text-zinc-600 text-xs mt-3">PDF, PNG, JPG, JPEG, TIFF · Max 20MB</p>
        </div>
      )}
    </div>
  );
}

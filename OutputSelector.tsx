"use client";

import { OutputFormat } from "@/types";

const OUTPUT_FORMATS: { value: OutputFormat; label: string; desc: string }[] = [
  { value: "ocr", label: "OCR Text", desc: "Raw extracted text" },
  { value: "json", label: "JSON Output", desc: "Structured data" },
  { value: "raw", label: "Raw", desc: "Full model dump" },
];

interface Props {
  selected: OutputFormat;
  onChange: (format: OutputFormat) => void;
}

export default function OutputSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {OUTPUT_FORMATS.map(({ value, label, desc }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            flex flex-col items-start px-5 py-3 rounded-lg text-sm font-semibold
            transition-all duration-200 select-none min-w-[110px]
            ${
              selected === value
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                : "bg-[#2a2a2a] text-zinc-400 hover:bg-[#333] hover:text-zinc-200 border border-[#3a3a3a]"
            }
          `}
        >
          <span className="font-bold tracking-wide">{label}</span>
          <span className={`text-xs mt-0.5 font-normal ${selected === value ? "text-orange-100" : "text-zinc-500"}`}>
            {desc}
          </span>
        </button>
      ))}
    </div>
  );
}

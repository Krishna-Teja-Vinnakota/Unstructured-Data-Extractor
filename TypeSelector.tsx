"use client";

import { DocType } from "@/types";

const DOC_TYPES: { value: DocType; label: string; icon: string }[] = [
  { value: "contract", label: "Contract", icon: "📄" },
  { value: "table", label: "Table", icon: "📊" },
  { value: "invoice", label: "Invoice", icon: "🧾" },
  { value: "handwriting", label: "Handwriting", icon: "✍️" },
];

interface Props {
  selected: DocType;
  onChange: (type: DocType) => void;
}

export default function TypeSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {DOC_TYPES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
            transition-all duration-200 select-none tracking-wide
            ${
              selected === value
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                : "bg-[#2a2a2a] text-zinc-400 hover:bg-[#333] hover:text-zinc-200 border border-[#3a3a3a]"
            }
          `}
        >
          <span className="text-base leading-none">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

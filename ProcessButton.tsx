"use client";

interface Props {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

export default function ProcessButton({ onClick, disabled, isProcessing }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase
        transition-all duration-200 relative overflow-hidden
        ${
          disabled
            ? "bg-[#2a2a2a] text-zinc-600 cursor-not-allowed border border-[#333]"
            : "bg-orange-500 hover:bg-orange-400 text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99]"
        }
      `}
    >
      {isProcessing ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Processing…
        </span>
      ) : (
        "Process Document"
      )}
    </button>
  );
}

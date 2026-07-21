import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocumentAI — Mistral-powered OCR & Extraction",
  description: "Process contracts, invoices, tables, and handwriting with Mistral AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#141414]">{children}</body>
    </html>
  );
}

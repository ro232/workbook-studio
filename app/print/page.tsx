"use client";

import { useEffect, useState } from "react";
import { PageRenderer } from "@/components/templates/PageRenderer";
import type { Workbook } from "@/types/workbook";

export default function PrintPage() {
  const [wb, setWb] = useState<Workbook | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("workbook-studio:print");
    if (!raw) return;
    try {
      setWb(JSON.parse(raw) as Workbook);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!wb) return;
    const t = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(t);
  }, [wb]);

  if (!wb) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[var(--color-ink-muted)]">
        Loading workbook…
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="no-print fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-ink)] text-white text-xs px-4 py-2 rounded-full shadow-lg">
        Opening print dialog… choose your printer or "Save as PDF"
      </div>
      {wb.pages.map((page, i) => (
        <div
          key={page.id}
          className="print-page flex items-center justify-center"
          style={{
            width: "100vw",
            minHeight: "100vh",
            pageBreakAfter: i === wb.pages.length - 1 ? "auto" : "always",
          }}
        >
          <div className="[&>svg]:max-w-full [&>svg]:max-h-screen">
            <PageRenderer page={page} workbook={wb} pageIndex={i} totalPages={wb.pages.length} />
          </div>
        </div>
      ))}
    </main>
  );
}

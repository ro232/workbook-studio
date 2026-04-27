"use client";

import { useState } from "react";
import { useWizard } from "@/lib/store";
import { PageRenderer } from "./templates/PageRenderer";
import { ChevronLeft, ChevronRight, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

export function Preview() {
  const { workbook } = useWizard();
  const [pageIdx, setPageIdx] = useState(0);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const total = workbook.pages.length;
  const safeIdx = Math.min(pageIdx, Math.max(0, total - 1));
  const page = workbook.pages[safeIdx];

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-ink-muted)] text-sm">
        Configure your workbook to see a preview.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-1 pb-3 text-xs text-[var(--color-ink-muted)]">
        <span className="uppercase tracking-widest">Live preview · {workbook.format}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSafeArea((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] transition",
              showSafeArea
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "hover:bg-white"
            )}
            title="Toggle print-safe area overlay"
          >
            <Ruler size={11} /> Safe area
          </button>
          <span>Page {safeIdx + 1} of {total}</span>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center bg-[#f3f1ec] rounded-[var(--radius-card)] border border-[var(--color-border)] overflow-hidden">
        {/* Paper shadow stage */}
        <div
          className="bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25),0_8px_20px_-12px_rgba(0,0,0,0.18)]"
          style={{
            width: "min(70%, 380px)",
            aspectRatio: workbook.format === "A5"
              ? "148/210"
              : workbook.format === "A2"
              ? "420/594"
              : workbook.format === "Letter"
              ? "215.9/279.4"
              : "210/297",
          }}
        >
          <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
            <PageRenderer page={page} workbook={workbook} pageIndex={safeIdx} totalPages={total} showSafeArea={showSafeArea} />
          </div>
        </div>

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
              disabled={safeIdx === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-30 flex items-center justify-center transition"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPageIdx((i) => Math.min(total - 1, i + 1))}
              disabled={safeIdx === total - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-30 flex items-center justify-center transition"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {workbook.pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPageIdx(i)}
              className={`shrink-0 w-12 rounded-md border-2 transition ${
                i === safeIdx
                  ? "border-[var(--color-accent)] shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{
                aspectRatio: workbook.format === "A5" ? "148/210" : "210/297",
              }}
              aria-label={`Page ${i + 1}`}
            >
              <div className="w-full h-full bg-white rounded-sm overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                <PageRenderer page={p} workbook={workbook} pageIndex={i} totalPages={total} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Wizard } from "@/components/Wizard";
import { Preview } from "@/components/Preview";
import { useWizard } from "@/lib/store";
import { ChevronLeft, RotateCcw } from "lucide-react";

export default function CreatePage() {
  const { reset } = useWizard();

  return (
    <main className="h-screen flex flex-col">
      <h1 className="sr-only">Create your personalized workbook</h1>
      {/* Top bar */}
      <header className="shrink-0 px-4 sm:px-6 h-14 border-b border-[var(--color-border)] bg-white flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
          <ChevronLeft size={16} aria-hidden="true" /> Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--color-accent)] text-white flex items-center justify-center text-xs font-bold">W</div>
          <span className="font-[Fraunces,serif] font-semibold">Workbook Studio</span>
        </div>
        <button
          onClick={reset}
          className="text-sm flex items-center gap-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </header>

      {/* Workspace — desktop two-pane, mobile stacked */}
      <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Wizard pane */}
        <section className="flex-1 min-h-0 overflow-y-auto bg-white border-r border-[var(--color-border)] order-2 lg:order-1">
          <div className="max-w-xl mx-auto h-full px-5 sm:px-8 lg:px-12 py-6 lg:py-10">
            <Wizard />
          </div>
        </section>

        {/* Preview pane */}
        <section className="shrink-0 lg:flex-1 lg:min-h-0 h-[42vh] lg:h-auto p-4 lg:p-8 bg-[var(--color-bg)] border-b lg:border-b-0 border-[var(--color-border)] order-1 lg:order-2 flex flex-col">
          <Preview />
        </section>
      </div>
    </main>
  );
}

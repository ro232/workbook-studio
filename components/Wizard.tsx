"use client";

import { useEffect } from "react";
import { useWizard, STEP_ORDER, type WizardStep } from "@/lib/store";
import { PRODUCT_TYPES, ACTIVITIES } from "@/lib/activities";
import { PAPER_STYLES } from "@/lib/paper-styles";
import { PAGE_SIZES } from "@/lib/page-sizes";
import { AGE_PRESETS } from "@/lib/age-presets";
import type { PageFormat, PaperStyle, ProductType, ColorMode, Theme, TracingStyle, MarginPreset } from "@/types/workbook";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Printer, Download, Sparkles, Loader2 } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { useState } from "react";

const STEP_LABELS: Record<WizardStep, string> = {
  type: "Type",
  child: "Child",
  format: "Format",
  paper: "Paper",
  activities: "Activities",
  customize: "Design",
  preview: "Preview",
};

export function Wizard() {
  const s = useWizard();

  // Rebuild pages on first mount so preview is populated
  useEffect(() => {
    s.rebuildPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepIdx = STEP_ORDER.indexOf(s.step);

  return (
    <div className="flex flex-col h-full">
      <StepIndicator current={s.step} />

      <div className="flex-1 overflow-y-auto px-1 py-6">
        {s.step === "type" && <StepType />}
        {s.step === "child" && <StepChild />}
        {s.step === "format" && <StepFormat />}
        {s.step === "paper" && <StepPaper />}
        {s.step === "activities" && <StepActivities />}
        {s.step === "customize" && <StepCustomize />}
        {s.step === "preview" && <StepPreview />}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
        <button
          onClick={s.prev}
          disabled={stepIdx === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} aria-hidden="true" /> Back
        </button>

        <span className="text-xs text-[var(--color-ink-muted)]">
          Step {stepIdx + 1} of {STEP_ORDER.length}
        </span>

        {s.step !== "preview" ? (
          <button
            onClick={s.next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[#265648] transition shadow-sm"
          >
            Continue <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <ExportButtons />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: WizardStep }) {
  const idx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {STEP_ORDER.map((step, i) => (
        <div key={step} className="flex items-center gap-1.5 flex-1">
          <div
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              i <= idx ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
            )}
          />
        </div>
      ))}
    </div>
  );
}

/* ============ STEP COMPONENTS ============ */

function StepType() {
  const { productType, setProductType } = useWizard();
  return (
    <StepShell
      eyebrow="Step 1"
      title="What would you like to create?"
      subtitle="Pick a starting point — you can customize everything later."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRODUCT_TYPES.map((p) => (
          <button
            key={p.id}
            onClick={() => setProductType(p.id as ProductType)}
            aria-pressed={productType === p.id}
            className={cn(
              "text-left p-4 rounded-2xl border transition group",
              productType === p.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-sm"
                : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="text-2xl">{p.emoji}</div>
              {productType === p.id && (
                <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                  <Check size={12} aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="mt-3 font-semibold">{p.label}</div>
            <div className="text-sm text-[var(--color-ink-muted)] mt-1">{p.description}</div>
            <div className="text-xs text-[var(--color-accent)] mt-2 font-medium">{p.pageCount}</div>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function StepChild() {
  const { child, setChild, setPhoto, title, setTitle, applyAgePreset } = useWizard();
  return (
    <StepShell
      eyebrow="Step 2"
      title="Tell us about the child"
      subtitle="Their name will appear on every tracing page and the cover."
    >
      <div className="space-y-5">
        <div>
          <Label>Quick start by age (optional)</Label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {AGE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyAgePreset(p.id)}
                className="p-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-accent-soft)]/30 transition text-left"
              >
                <div className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium">{p.label}</div>
                <div className="text-xs text-[var(--color-ink-muted)] mt-1 leading-snug">{p.description}</div>
              </button>
            ))}
          </div>
        </div>

        <Field label="Child's name">
          <input
            value={child.name}
            onChange={(e) => setChild({ name: e.target.value })}
            placeholder="e.g. Tudor"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-accent)] text-base"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Age">
            <input
              type="number"
              min={2}
              max={12}
              value={child.age || ""}
              onChange={(e) => setChild({ age: Number(e.target.value) || undefined })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-accent)]"
            />
          </Field>
          <Field label="Level">
            <select
              value={child.level || "beginner"}
              onChange={(e) => setChild({ level: e.target.value as "beginner" | "intermediate" | "advanced" })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
        </div>

        <Field label="Workbook title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tudor's First Tracing Workbook"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </Field>

        <div>
          <Label>Cover photo (optional)</Label>
          <div className="mt-1.5">
            <PhotoUpload photo={child.photo} onChange={setPhoto} />
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function StepFormat() {
  const { format, setFormat } = useWizard();
  return (
    <StepShell eyebrow="Step 3" title="Choose your paper size" subtitle="A4 is most common for home printers.">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PAGE_SIZES).map(([key, dim]) => (
          <button
            key={key}
            onClick={() => setFormat(key as PageFormat)}
            aria-pressed={format === key}
            className={cn(
              "p-4 rounded-2xl border transition flex flex-col items-center gap-3",
              format === key
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-sm"
                : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
            )}
          >
            <div
              className="bg-white border border-[var(--color-border)] shadow-sm rounded"
              style={{
                width: 60,
                height: (60 * dim.height) / dim.width,
                maxHeight: 80,
              }}
            />
            <div className="text-center">
              <div className="font-semibold">{dim.label}</div>
              <div className="text-xs text-[var(--color-ink-muted)]">{dim.description}</div>
            </div>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function StepPaper() {
  const { paperStyle, setPaperStyle } = useWizard();
  return (
    <StepShell eyebrow="Step 4" title="Pick a paper style" subtitle="The lines or grid printed on each page.">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PAPER_STYLES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaperStyle(p.id as PaperStyle)}
            aria-pressed={paperStyle === p.id}
            className={cn(
              "p-3 rounded-2xl border text-left transition",
              paperStyle === p.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-sm"
                : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
            )}
          >
            <PaperPreviewSwatch style={p.id as PaperStyle} />
            <div className="font-medium mt-2 text-sm">{p.label}</div>
            <div className="text-xs text-[var(--color-ink-muted)] truncate" title={p.description}>
              {p.romanian}
            </div>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function PaperPreviewSwatch({ style }: { style: PaperStyle }) {
  return (
    <div className="aspect-[3/4] bg-white rounded-md border border-[var(--color-border)] overflow-hidden">
      <svg viewBox="0 0 60 80" className="w-full h-full">
        {style === "blank" || style === "drawing" ? null : null}
        {style === "dictando" &&
          Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={6} y1={12 + i * 8} x2={54} y2={12 + i * 8} stroke="#bcd0c9" strokeWidth={0.4} />
          ))}
        {style === "math" && (
          <g>
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={6 + i * 4.8} y1={6} x2={6 + i * 4.8} y2={74} stroke="#dde7e3" strokeWidth={0.3} />
            ))}
            {Array.from({ length: 15 }, (_, i) => (
              <line key={`h${i}`} x1={6} y1={6 + i * 4.8} x2={54} y2={6 + i * 4.8} stroke="#dde7e3" strokeWidth={0.3} />
            ))}
          </g>
        )}
        {style === "dotted" && (
          <g>
            {Array.from({ length: 10 }, (_, i) =>
              Array.from({ length: 13 }, (_, j) => (
                <circle key={`${i}-${j}`} cx={6 + i * 5.3} cy={6 + j * 5.6} r={0.5} fill="#bcd0c9" />
              ))
            )}
          </g>
        )}
        {style === "handwriting" &&
          Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <line x1={6} y1={10 + i * 18} x2={54} y2={10 + i * 18} stroke="#dde7e3" strokeWidth={0.4} />
              <line x1={6} y1={16 + i * 18} x2={54} y2={16 + i * 18} stroke="#bcd0c9" strokeWidth={0.4} strokeDasharray="1.5,1.5" />
              <line x1={6} y1={22 + i * 18} x2={54} y2={22 + i * 18} stroke="#dde7e3" strokeWidth={0.4} />
            </g>
          ))}
        {style === "tracing-lines" &&
          Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <line x1={6} y1={12 + i * 16} x2={54} y2={12 + i * 16} stroke="#dde7e3" strokeWidth={0.4} />
              <line x1={6} y1={20 + i * 16} x2={54} y2={20 + i * 16} stroke="#9aa3a8" strokeWidth={0.4} />
            </g>
          ))}
      </svg>
    </div>
  );
}

function StepActivities() {
  const { activities, toggleActivity, productType } = useWizard();
  const isPreset = productType !== "custom-book" && productType !== "single";

  return (
    <StepShell
      eyebrow="Step 5"
      title="Choose activities"
      subtitle={
        isPreset
          ? "This preset already includes the right activities. You can override them below."
          : "Pick what should appear in your workbook."
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {ACTIVITIES.map((a) => {
          const on = activities.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggleActivity(a.id)}
              aria-pressed={on}
              className={cn(
                "p-3 rounded-xl border text-left transition flex items-start gap-3",
                on
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0",
                  on ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white" : "border-[var(--color-border)]"
                )}
              >
                {on && <Check size={12} aria-hidden="true" />}
              </div>
              <div>
                <div className="font-medium text-sm">{a.label}</div>
                <div className="text-xs text-[var(--color-ink-muted)] mt-0.5">{a.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function StepCustomize() {
  const {
    colorMode, setColorMode,
    theme, setTheme,
    tracingStyle, setTracingStyle,
    lineThickness, setLineThickness,
    marginPreset, setMarginPreset,
    rebuildPages,
  } = useWizard();

  // Apply changes that affect rendering immediately
  const onTracingStyle = (s: TracingStyle) => { setTracingStyle(s); rebuildPages(); };
  const onLineThickness = (n: number) => { setLineThickness(n); rebuildPages(); };
  const onMarginPreset = (p: MarginPreset) => { setMarginPreset(p); rebuildPages(); };

  return (
    <StepShell eyebrow="Step 6" title="Design" subtitle="Final touches before you preview and print.">
      <div className="space-y-6">
        <div>
          <Label>Color mode</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(["color", "bw"] as ColorMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setColorMode(m)}
                aria-pressed={colorMode === m}
                className={cn(
                  "px-4 py-3 rounded-xl border text-sm font-medium transition",
                  colorMode === m
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
                )}
              >
                {m === "color" ? "Premium color" : "Black & white (saves ink)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Tracing letter style</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {(["dotted", "dashed", "outline", "arrow"] as TracingStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => onTracingStyle(s)}
                aria-pressed={tracingStyle === s}
                className={cn(
                  "p-3 rounded-xl border transition flex flex-col items-center gap-1.5",
                  tracingStyle === s
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
                )}
              >
                <TracingStyleSwatch style={s} />
                <div className="text-xs font-medium capitalize">{s}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Line thickness</Label>
            <span className="text-xs text-[var(--color-ink-muted)] tabular-nums">{lineThickness.toFixed(2)}×</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.05}
            value={lineThickness}
            onChange={(e) => onLineThickness(Number(e.target.value))}
            className="w-full mt-2 accent-[var(--color-accent)]"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-ink-muted)] mt-0.5 uppercase tracking-widest">
            <span>Fine</span>
            <span>Standard</span>
            <span>Bold</span>
          </div>
        </div>

        <div>
          <Label>Page margins</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(["narrow", "normal", "wide"] as MarginPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => onMarginPreset(p)}
                aria-pressed={marginPreset === p}
                className={cn(
                  "p-3 rounded-xl border transition flex flex-col items-center gap-1.5",
                  marginPreset === p
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
                )}
              >
                <MarginSwatch preset={p} />
                <div className="text-xs font-medium capitalize">{p}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Cover theme</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {(["minimalist", "animals", "space", "princess"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn(
                  "px-3 py-3 rounded-xl border text-sm capitalize transition",
                  theme === t
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function TracingStyleSwatch({ style }: { style: TracingStyle }) {
  const props =
    style === "dotted"
      ? { strokeDasharray: "0.4 4", strokeLinecap: "round" as const }
      : style === "dashed"
      ? { strokeDasharray: "5 4", strokeLinecap: "round" as const }
      : style === "outline"
      ? {}
      : { strokeDasharray: "8 4", strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 56 28" className="w-full h-7">
      <text
        x={28}
        y={22}
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize={22}
        fill="none"
        stroke="#2f6b5e"
        strokeWidth={1.6}
        {...props}
      >
        Aa
      </text>
    </svg>
  );
}

function MarginSwatch({ preset }: { preset: MarginPreset }) {
  const inset = preset === "narrow" ? 3 : preset === "wide" ? 9 : 6;
  return (
    <svg viewBox="0 0 40 56" className="w-8 h-11">
      <rect x={1} y={1} width={38} height={54} fill="white" stroke="#cfd6d2" strokeWidth={0.6} rx={2} />
      <rect x={inset} y={inset} width={40 - 2 * inset} height={56 - 2 * inset} fill="none" stroke="#2f6b5e" strokeWidth={0.5} strokeDasharray="2 1.5" rx={1} />
    </svg>
  );
}

function StepPreview() {
  const { workbook } = useWizard();
  return (
    <StepShell
      eyebrow="Final step"
      title="Review your workbook"
      subtitle={`${workbook.pages.length} pages ready — ${workbook.format}, ${workbook.colorMode === "bw" ? "B&W" : "color"}.`}
    >
      <div className="rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20 p-5 flex items-start gap-3">
        <Sparkles className="text-[var(--color-accent)] shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="text-sm leading-relaxed">
          Your workbook is ready. Use the buttons below to <strong>print</strong> directly or open the print dialog and choose <strong>"Save as PDF"</strong>. The preview on the right matches the final output exactly.
        </div>
      </div>
    </StepShell>
  );
}

function ExportButtons() {
  const { workbook } = useWizard();
  const [pdfBusy, setPdfBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPrint = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("workbook-studio:print", JSON.stringify(workbook));
      window.open(`/print?id=${workbook.id}`, "_blank");
    }
  };

  const onPdf = async () => {
    setError(null);
    setPdfBusy(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workbook }),
      });
      if (!res.ok) {
        let msg = `PDF generation failed (${res.status})`;
        try { const j = await res.json(); if (j?.detail) msg = j.detail; } catch {}
        throw new Error(msg);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (workbook.title || "workbook").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 60) || "workbook";
      a.download = `${safe}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF failed");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex gap-2">
        <button
          onClick={onPdf}
          disabled={pdfBusy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-white border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition disabled:opacity-60"
        >
          {pdfBusy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
          {pdfBusy ? "Generating…" : "PDF"}
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[#265648] transition shadow-sm"
        >
          <Printer size={16} aria-hidden="true" /> Print
        </button>
      </div>
      {error && <div className="text-xs text-red-600 max-w-xs text-right">{error}</div>}
    </div>
  );
}

/* ============ helpers ============ */

function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-2">
        {eyebrow}
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold font-[Fraunces,serif] mb-1">{title}</h2>
      {subtitle && <p className="text-[var(--color-ink-muted)] text-sm mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-widest font-medium text-[var(--color-ink-muted)]">
      {children}
    </span>
  );
}

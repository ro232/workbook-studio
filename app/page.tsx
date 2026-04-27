import Link from "next/link";
import { ArrowRight, Sparkles, Printer, FileText, Layers, Heart } from "lucide-react";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { newWorkbook } from "@/lib/generators";
import type { Workbook } from "@/types/workbook";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-bold">
            W
          </div>
          <span className="font-[Fraunces,serif] text-lg font-semibold">Workbook Studio</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-[var(--color-ink-muted)]">
          <a className="hover:text-[var(--color-ink)] transition" href="#features">Features</a>
          <a className="hover:text-[var(--color-ink)] transition" href="#how">How it works</a>
          <a className="hover:text-[var(--color-ink)] transition" href="#examples">Examples</a>
        </nav>
        <Link
          href="/create"
          className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-ink)] text-white hover:bg-black transition"
        >
          Start free →
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 sm:px-10 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-xs font-medium tracking-wide">
              <Sparkles size={12} /> PERSONALIZED · PRINTABLE · PREMIUM
            </div>
            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-[Fraunces,serif] font-semibold leading-[1.05] tracking-tight">
              Beautiful workbooks,
              <br />
              <span className="text-[var(--color-accent)]">made for your child.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-ink-muted)] max-w-xl leading-relaxed">
              Personalized tracing books, alphabet pages, math practice and dictando — printed at home or saved as PDF in under a minute. Designed by parents and educators, made for kids who deserve better than worksheet dumps.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-accent)] text-white font-medium hover:bg-[#265648] transition shadow-sm"
              >
                Create a workbook <ArrowRight size={18} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--color-border)] bg-white font-medium hover:bg-[var(--color-bg)] transition"
              >
                See how it works
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-[var(--color-ink-muted)]">
              <div className="flex items-center gap-2"><Heart size={14} className="text-[var(--color-warm)]" /> No login needed</div>
              <div className="flex items-center gap-2"><FileText size={14} className="text-[var(--color-accent)]" /> Print or PDF</div>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 sm:px-10 py-20 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-[Fraunces,serif] font-semibold tracking-tight">
            Everything a printable workbook should be.
          </h2>
          <p className="text-[var(--color-ink-muted)] mt-3 max-w-2xl">
            Premium typography, real paper sizes, and thoughtful layouts — not the usual blurry PDF you find online.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            <Feature
              icon={<Layers size={20} />}
              title="Real workbooks, not worksheets"
              body="Generate complete books with covers, page numbers, and a coherent design — like something you'd buy in a bookstore."
            />
            <Feature
              icon={<Sparkles size={20} />}
              title="Personalized to your child"
              body="Their name on the cover, their name on the tracing pages. Age-aware difficulty. Editor-friendly typography."
            />
            <Feature
              icon={<FileText size={20} />}
              title="A4, A5, A2 or US Letter"
              body="Mm-precise rendering means what you see is what prints. No surprises, no fuzzy lines."
            />
            <Feature
              icon={<Printer size={20} />}
              title="Print-ready out of the box"
              body="Save as PDF or send straight to your printer. Both routes use the same template, so output is identical."
            />
            <Feature
              icon={<Heart size={20} />}
              title="Calm, premium aesthetic"
              body="Inspired by good editorial design — not chaotic primary colors. Your child deserves a beautiful workbook."
            />
            <Feature
              icon={<Layers size={20} />}
              title="Batch generation"
              body="Full alphabet, numbers, name books, custom 10/20/30/50-page collections — all in a few clicks."
            />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="px-6 sm:px-10 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-[Fraunces,serif] font-semibold tracking-tight">
          From child name to printed workbook in 60 seconds.
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          <Step n="1" title="Pick a starting point" body="Single page, alphabet book, name book, custom — your call." />
          <Step n="2" title="Tell us about your child" body="Name, age, level. We tailor every page to them." />
          <Step n="3" title="Print or save as PDF" body="Live preview matches the printed result, exactly." />
        </div>
        <div className="mt-12">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-accent)] text-white font-medium hover:bg-[#265648] transition shadow-sm"
          >
            Start your first workbook <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] py-10 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4 text-sm text-[var(--color-ink-muted)]">
          <div>© {new Date().getFullYear()} Workbook Studio</div>
          <div>Made with care for parents and educators.</div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-[var(--color-ink-muted)] leading-relaxed">{body}</div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)]">
      <div className="font-[Fraunces,serif] text-4xl font-semibold text-[var(--color-accent)]">{n}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-[var(--color-ink-muted)] leading-relaxed">{body}</div>
    </div>
  );
}

function HeroPreview() {
  // Three real workbook samples rendered via the same engine that powers the editor.
  const sampleWorkbook: Workbook = newWorkbook({
    title: "Tudor's First Tracing Workbook",
    child: { name: "Tudor", age: 5 },
    theme: "minimalist",
  });

  const coverPage = { id: "h1", type: "cover" as const, paperStyle: "blank" as const, data: {} };
  const letterPage = {
    id: "h2",
    type: "letter-tracing" as const,
    paperStyle: "tracing-lines" as const,
    data: { letter: "A", repetitions: 4 },
  };
  const namePage = {
    id: "h3",
    type: "name-tracing" as const,
    paperStyle: "tracing-lines" as const,
    data: { name: "Tudor", repetitions: 4 },
  };

  return (
    <div className="relative aspect-[5/6] rounded-3xl bg-gradient-to-br from-[var(--color-accent-soft)] via-white to-[var(--color-warm-soft)] border border-[var(--color-border)] p-8 flex items-center justify-center overflow-hidden">
      {/* Cover - rotated left */}
      <div className="absolute top-10 left-6 w-40 aspect-[210/297] bg-white rounded-md shadow-2xl rotate-[-8deg] border border-[var(--color-border)] overflow-hidden">
        <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
          <PageRenderer page={coverPage} workbook={sampleWorkbook} pageIndex={0} totalPages={3} />
        </div>
      </div>
      {/* Letter A - rotated right */}
      <div className="absolute bottom-10 right-6 w-44 aspect-[210/297] bg-white rounded-md shadow-2xl rotate-[6deg] border border-[var(--color-border)] overflow-hidden">
        <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
          <PageRenderer page={letterPage} workbook={sampleWorkbook} pageIndex={1} totalPages={3} />
        </div>
      </div>
      {/* Name tracing - centered, on top */}
      <div className="relative w-44 aspect-[210/297] bg-white rounded-md shadow-2xl border border-[var(--color-border)] z-10 overflow-hidden">
        <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
          <PageRenderer page={namePage} workbook={sampleWorkbook} pageIndex={2} totalPages={3} />
        </div>
      </div>
    </div>
  );
}

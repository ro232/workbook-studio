import type { PaperStyle } from "@/types/workbook";

export interface PaperStyleMeta {
  id: PaperStyle;
  label: string;
  description: string;
  romanian: string;
}

export const PAPER_STYLES: PaperStyleMeta[] = [
  { id: "blank", label: "Blank", romanian: "Velină", description: "Plain white paper, perfect for drawing or free writing." },
  { id: "dictando", label: "Dictando", romanian: "Dictando", description: "Single-line ruled paper for handwriting practice." },
  { id: "math", label: "Math Grid", romanian: "Matematică", description: "Squared paper with 5 mm grid for math and numbers." },
  { id: "dotted", label: "Dotted", romanian: "Punctat", description: "Dot grid — calm and flexible for sketching or letters." },
  { id: "drawing", label: "Drawing", romanian: "Desen", description: "Fully blank, slightly cream — premium drawing surface." },
  { id: "handwriting", label: "Handwriting", romanian: "Caligrafie", description: "Three-line guides for early letter formation." },
  { id: "tracing-lines", label: "Tracing Lines", romanian: "Trasare", description: "Faint guide-lines for tracing exercises." },
];

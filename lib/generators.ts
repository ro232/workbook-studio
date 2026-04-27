import { nanoid } from "nanoid";
import { PAGE_SIZES } from "./page-sizes";
import { ROMANIAN_ALPHABET_UPPER, ROMANIAN_FIRST_WORDS } from "./romanian";
import type {
  PageConfig,
  PaperStyle,
  ProductType,
  Workbook,
  ChildProfile,
  PageFormat,
} from "@/types/workbook";

function pid() {
  return nanoid(8);
}

export function genCoverPage(): PageConfig {
  return {
    id: pid(),
    type: "cover",
    paperStyle: "blank",
    data: {},
  };
}

export function genNameTracingPages(name: string, count: number = 4): PageConfig[] {
  return Array.from({ length: count }, () => ({
    id: pid(),
    type: "name-tracing",
    paperStyle: "tracing-lines",
    data: { name, repetitions: 4 },
  }));
}

export function genAlphabetPages(paperStyle: PaperStyle = "tracing-lines"): PageConfig[] {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
    id: pid(),
    type: "letter-tracing",
    paperStyle,
    data: { letter, repetitions: 6 },
  }));
}

export function genRomanianAlphabetPages(paperStyle: PaperStyle = "tracing-lines"): PageConfig[] {
  return ROMANIAN_ALPHABET_UPPER.map((letter) => ({
    id: pid(),
    type: "letter-tracing",
    paperStyle,
    data: { letter, repetitions: 6 },
  }));
}

export function genRomanianHandwritingPages(): PageConfig[] {
  return ROMANIAN_FIRST_WORDS.slice(0, 10).map((word) => ({
    id: pid(),
    type: "handwriting-3line",
    paperStyle: "blank",
    data: { word, rows: 6, lineSpacing: 14 },
  }));
}

export function genNumberPages(paperStyle: PaperStyle = "tracing-lines", upTo: number = 9): PageConfig[] {
  return Array.from({ length: upTo + 1 }, (_, i) => ({
    id: pid(),
    type: "number-tracing",
    paperStyle,
    data: { number: i, repetitions: 6 },
  }));
}

export function genShapePages(): PageConfig[] {
  const shapes = ["circle", "square", "triangle", "star", "heart", "rectangle"];
  return shapes.map((shape) => ({
    id: pid(),
    type: "shape-tracing",
    paperStyle: "blank",
    data: { shape, repetitions: 4 },
  }));
}

export function genColorLetterPages(letters: string[] = ["A", "B", "C", "D", "E"]): PageConfig[] {
  return letters.map((letter) => ({
    id: pid(),
    type: "color-letter",
    paperStyle: "blank",
    data: { letter },
  }));
}

export function genColorNumberPages(nums: number[] = [1, 2, 3, 4, 5]): PageConfig[] {
  return nums.map((number) => ({
    id: pid(),
    type: "color-number",
    paperStyle: "blank",
    data: { number },
  }));
}

export function genColorShapePages(): PageConfig[] {
  const shapes = ["circle", "square", "triangle", "star", "heart"];
  return shapes.map((shape) => ({
    id: pid(),
    type: "color-shape",
    paperStyle: "blank",
    data: { shape },
  }));
}

export function genConnectDotsPages(): PageConfig[] {
  // Pre-defined dot patterns: simple shapes encoded as dot positions
  const patterns = [
    { name: "Star", dots: starDots() },
    { name: "House", dots: houseDots() },
    { name: "Heart", dots: heartDots() },
  ];
  return patterns.map((p) => ({
    id: pid(),
    type: "connect-dots",
    paperStyle: "blank",
    data: { name: p.name, dots: p.dots },
  }));
}

export function genHandwritingPages(words: string[] = ["mama", "papa", "casa", "soare"]): PageConfig[] {
  return words.map((word) => ({
    id: pid(),
    type: "handwriting-3line",
    paperStyle: "blank",
    data: { word, rows: 6, lineSpacing: 14 },
  }));
}

function starDots() {
  // 10-point star
  const cx = 50, cy = 50, r1 = 30, r2 = 12;
  const pts: { x: number; y: number; n: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, n: i + 1 });
  }
  return pts;
}

function houseDots() {
  return [
    { x: 30, y: 60, n: 1 },
    { x: 30, y: 30, n: 2 },
    { x: 50, y: 15, n: 3 },
    { x: 70, y: 30, n: 4 },
    { x: 70, y: 60, n: 5 },
    { x: 30, y: 60, n: 6 },
  ];
}

function heartDots() {
  const cx = 50, cy = 50, s = 25;
  const dots: { x: number; y: number; n: number }[] = [];
  const total = 14;
  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const x = cx + 16 * Math.pow(Math.sin(t), 3);
    const y = cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    dots.push({ x, y, n: i + 1 });
  }
  return dots;
}

export interface BuildOpts {
  productType: ProductType;
  child: ChildProfile;
  paperStyle: PaperStyle;
  selectedActivities: string[];
  customPageCount?: number;
}

export function buildPages(opts: BuildOpts): PageConfig[] {
  const cover = genCoverPage();
  switch (opts.productType) {
    case "name-book":
      return [cover, ...genNameTracingPages(opts.child.name, 8)];
    case "alphabet-book":
      return [cover, ...genAlphabetPages(opts.paperStyle)];
    case "alphabet-book-ro":
      return [cover, ...genRomanianAlphabetPages(opts.paperStyle)];
    case "handwriting-ro":
      return [cover, ...genRomanianHandwritingPages()];
    case "numbers-book":
      return [cover, ...genNumberPages(opts.paperStyle, 9)];
    case "shapes-book":
      return [cover, ...genShapePages()];
    case "single":
      return [
        {
          id: pid(),
          type: opts.selectedActivities[0] as PageConfig["type"] || "blank",
          paperStyle: opts.paperStyle,
          data: { letter: "A", number: 1, name: opts.child.name, repetitions: 4 },
        },
      ];
    case "custom-book":
    default: {
      const pages: PageConfig[] = [cover];
      const includes = (a: string) => opts.selectedActivities.includes(a);
      if (includes("name-tracing")) pages.push(...genNameTracingPages(opts.child.name, 3));
      if (includes("letter-tracing")) pages.push(...genAlphabetPages(opts.paperStyle).slice(0, 8));
      if (includes("number-tracing")) pages.push(...genNumberPages(opts.paperStyle, 9));
      if (includes("shape-tracing")) pages.push(...genShapePages());
      if (includes("handwriting-3line")) pages.push(...genHandwritingPages());
      if (includes("color-letter")) pages.push(...genColorLetterPages());
      if (includes("color-number")) pages.push(...genColorNumberPages());
      if (includes("color-shape")) pages.push(...genColorShapePages());
      if (includes("connect-dots")) pages.push(...genConnectDotsPages());
      if (includes("coloring")) pages.push(...genColorShapePages().slice(0, 3));
      if (includes("blank")) {
        pages.push({ id: pid(), type: "blank", paperStyle: opts.paperStyle, data: {} });
      }
      return pages;
    }
  }
}

export function newWorkbook(partial: Partial<Workbook>): Workbook {
  const now = new Date().toISOString();
  const format: PageFormat = partial.format ?? "A4";
  return {
    id: nanoid(),
    title: "My Workbook",
    child: { name: "" },
    format,
    colorMode: "color",
    theme: "minimalist",
    lineColor: "#9aa3a8",
    lineThickness: 1.0,
    margins: PAGE_SIZES[format].defaultMargins,
    marginPreset: "normal",
    tracingStyle: "dotted",
    pages: [],
    meta: { createdAt: now, updatedAt: now },
    ...partial,
  };
}

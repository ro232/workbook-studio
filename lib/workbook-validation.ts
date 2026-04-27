import { PAGE_SIZES } from "./page-sizes";
import type { Workbook, ActivityType, PaperStyle, ChildPhoto } from "@/types/workbook";

const VALID_FORMATS = new Set(Object.keys(PAGE_SIZES));
const VALID_THEMES = new Set(["minimalist", "animals", "space", "princess"]);
const VALID_COLOR_MODES = new Set(["color", "bw"]);
const VALID_TRACING_STYLES = new Set(["dotted", "dashed", "outline", "arrow"]);
const VALID_MARGIN_PRESETS = new Set(["narrow", "normal", "wide", "custom"]);
const VALID_PAGE_TYPES = new Set<ActivityType>([
  "cover",
  "name-tracing",
  "letter-tracing",
  "number-tracing",
  "shape-tracing",
  "handwriting-3line",
  "coloring",
  "color-letter",
  "color-number",
  "color-shape",
  "connect-dots",
  "blank",
  "free-write",
]);
const VALID_PAPER_STYLES = new Set<PaperStyle>([
  "blank",
  "dictando",
  "math",
  "dotted",
  "drawing",
  "handwriting",
  "tracing-lines",
]);

export interface ValidationError {
  field: string;
  message: string;
}

const MAX_PAGES = 60;
const MAX_REPETITIONS = 12;
const MAX_DOTS_PER_PAGE = 80;
const MAX_TITLE_LENGTH = 200;
const MAX_NAME_LENGTH = 60;
const MAX_WORD_LENGTH = 60;

const DATA_URL_RE = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

/**
 * Validates and normalizes an incoming workbook payload.
 * Returns either a sanitized workbook or a list of errors.
 *
 * Sanitization includes:
 * - Clamping numeric ranges (repetitions, dots count, page count)
 * - Truncating long strings
 * - Rejecting non-data: URL photos (SSRF defense)
 * - Filling required fields with sensible defaults
 */
export function validateWorkbook(input: unknown): { ok: true; workbook: Workbook } | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ field: "root", message: "Body must be a JSON object" }] };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = input as any;

  if (typeof w.id !== "string" || !w.id) errors.push({ field: "id", message: "Required string" });
  if (typeof w.title !== "string") errors.push({ field: "title", message: "Required string" });
  if (!w.child || typeof w.child.name !== "string") {
    errors.push({ field: "child.name", message: "Required string" });
  }
  if (!VALID_FORMATS.has(w.format)) {
    errors.push({ field: "format", message: `Must be one of: ${[...VALID_FORMATS].join(", ")}` });
  }
  if (w.colorMode && !VALID_COLOR_MODES.has(w.colorMode)) {
    errors.push({ field: "colorMode", message: "Must be 'color' or 'bw'" });
  }
  if (w.theme && !VALID_THEMES.has(w.theme)) {
    errors.push({ field: "theme", message: `Unknown theme: ${w.theme}` });
  }
  if (w.tracingStyle && !VALID_TRACING_STYLES.has(w.tracingStyle)) {
    errors.push({ field: "tracingStyle", message: `Unknown tracingStyle: ${w.tracingStyle}` });
  }
  if (w.marginPreset && !VALID_MARGIN_PRESETS.has(w.marginPreset)) {
    errors.push({ field: "marginPreset", message: `Unknown marginPreset: ${w.marginPreset}` });
  }
  if (!Array.isArray(w.pages) || w.pages.length === 0) {
    errors.push({ field: "pages", message: "Must be a non-empty array" });
  } else if (w.pages.length > MAX_PAGES) {
    errors.push({ field: "pages", message: `Too many pages (max ${MAX_PAGES})` });
  }

  // Validate photo schema
  if (w.child?.photo) {
    const photo = w.child.photo as Partial<ChildPhoto>;
    if (typeof photo.dataUrl !== "string" || !DATA_URL_RE.test(photo.dataUrl)) {
      errors.push({ field: "child.photo.dataUrl", message: "Must be a base64 data: URL of an image" });
    }
  }

  if (errors.length) return { ok: false, errors };

  // Sanitize
  const safeTitle = String(w.title).slice(0, MAX_TITLE_LENGTH);
  const safeChildName = String(w.child.name).slice(0, MAX_NAME_LENGTH);

  const safePages = (w.pages as unknown[]).map((rawPage) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = rawPage as any;
    const type = VALID_PAGE_TYPES.has(p.type) ? (p.type as ActivityType) : "blank";
    const paperStyle = VALID_PAPER_STYLES.has(p.paperStyle) ? (p.paperStyle as PaperStyle) : "blank";
    const id = typeof p.id === "string" && p.id ? p.id.slice(0, 64) : `p-${Math.random().toString(36).slice(2, 10)}`;
    const data: Record<string, unknown> = { ...(p.data && typeof p.data === "object" ? p.data : {}) };

    // Clamp numeric fields
    if (typeof data.repetitions === "number") {
      data.repetitions = Math.max(1, Math.min(MAX_REPETITIONS, Math.floor(data.repetitions)));
    }
    if (typeof data.rows === "number") {
      data.rows = Math.max(1, Math.min(20, Math.floor(data.rows)));
    }
    if (typeof data.lineSpacing === "number") {
      data.lineSpacing = Math.max(8, Math.min(40, data.lineSpacing));
    }

    // Truncate string fields
    if (typeof data.word === "string") data.word = data.word.slice(0, MAX_WORD_LENGTH);
    if (typeof data.letter === "string") data.letter = data.letter.slice(0, 8);
    if (typeof data.number === "number") data.number = Math.max(0, Math.min(9999, Math.floor(data.number)));
    if (typeof data.name === "string") data.name = data.name.slice(0, MAX_NAME_LENGTH);
    if (typeof data.shape === "string") data.shape = data.shape.slice(0, 32);

    // Clamp dots array
    if (Array.isArray(data.dots)) {
      data.dots = (data.dots as unknown[])
        .slice(0, MAX_DOTS_PER_PAGE)
        .map((d) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dd = (d || {}) as any;
          return {
            x: clampNum(dd.x, 0, 100, 50),
            y: clampNum(dd.y, 0, 100, 50),
            n: clampNum(dd.n, 0, 9999, 1),
          };
        });
    }

    return { id, type, paperStyle, data };
  });

  // Build a sanitized workbook with safe fallbacks for any missing field
  const fmt = w.format as keyof typeof PAGE_SIZES;
  const defaultMargins = PAGE_SIZES[fmt].defaultMargins;

  const workbook: Workbook = {
    id: String(w.id).slice(0, 64),
    title: safeTitle,
    child: {
      name: safeChildName,
      age: typeof w.child.age === "number" ? Math.max(2, Math.min(18, Math.floor(w.child.age))) : undefined,
      level: ["beginner", "intermediate", "advanced"].includes(w.child.level) ? w.child.level : undefined,
      photo: w.child.photo,
    },
    format: fmt,
    colorMode: w.colorMode === "bw" ? "bw" : "color",
    theme: VALID_THEMES.has(w.theme) ? w.theme : "minimalist",
    lineColor: typeof w.lineColor === "string" && /^#[0-9a-f]{3,8}$/i.test(w.lineColor) ? w.lineColor : "#9aa3a8",
    lineThickness: typeof w.lineThickness === "number" ? Math.max(0.5, Math.min(2, w.lineThickness)) : 1,
    tracingStyle: VALID_TRACING_STYLES.has(w.tracingStyle) ? w.tracingStyle : "dotted",
    marginPreset: VALID_MARGIN_PRESETS.has(w.marginPreset) ? w.marginPreset : "normal",
    margins: isMargins(w.margins) ? w.margins : defaultMargins,
    pages: safePages,
    branding: w.branding,
    meta: w.meta || { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  };

  return { ok: true, workbook };
}

function clampNum(n: unknown, min: number, max: number, fallback: number): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(min, Math.min(max, v));
}

function isMargins(m: unknown): m is { top: number; right: number; bottom: number; left: number } {
  if (!m || typeof m !== "object") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x = m as any;
  return ["top", "right", "bottom", "left"].every((k) => typeof x[k] === "number");
}

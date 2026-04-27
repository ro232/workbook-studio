import type { ActivityType, PaperStyle, Theme } from "@/types/workbook";

export interface AgePreset {
  id: string;
  label: string;
  ageRange: string;
  description: string;
  activities: ActivityType[];
  paperStyle: PaperStyle;
  theme: Theme;
  /** Visual difficulty hint */
  intensity: "gentle" | "standard" | "challenging";
}

export const AGE_PRESETS: AgePreset[] = [
  {
    id: "3-4",
    label: "Ages 3–4",
    ageRange: "3-4",
    description: "Big shapes, large name tracing, lots of coloring. Calm pacing.",
    activities: ["name-tracing", "shape-tracing", "color-shape", "color-letter"],
    paperStyle: "tracing-lines",
    theme: "animals",
    intensity: "gentle",
  },
  {
    id: "5-6",
    label: "Ages 5–6",
    ageRange: "5-6",
    description: "Alphabet, numbers 0–9, simple shapes. The kindergarten staple.",
    activities: ["letter-tracing", "number-tracing", "shape-tracing", "name-tracing"],
    paperStyle: "tracing-lines",
    theme: "minimalist",
    intensity: "standard",
  },
  {
    id: "6-8",
    label: "Ages 6–8",
    ageRange: "6-8",
    description: "3-line handwriting, word tracing, connect-the-dots, dictando.",
    activities: ["handwriting-3line", "word-tracing", "connect-dots", "letter-tracing"],
    paperStyle: "handwriting",
    theme: "minimalist",
    intensity: "challenging",
  },
];

export function getAgePresetById(id: string): AgePreset | undefined {
  return AGE_PRESETS.find((p) => p.id === id);
}

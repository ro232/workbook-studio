"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Workbook,
  PageFormat,
  PaperStyle,
  ColorMode,
  Theme,
  ProductType,
  ChildProfile,
  TracingStyle,
  MarginPreset,
  Margins,
} from "@/types/workbook";
import { newWorkbook, buildPages } from "./generators";
import { PAGE_SIZES } from "./page-sizes";
import type { ChildPhoto } from "@/types/workbook";

export type WizardStep =
  | "type"
  | "child"
  | "format"
  | "paper"
  | "activities"
  | "customize"
  | "preview";

export const STEP_ORDER: WizardStep[] = [
  "type",
  "child",
  "format",
  "paper",
  "activities",
  "customize",
  "preview",
];

interface WizardState {
  step: WizardStep;
  productType: ProductType;
  child: ChildProfile;
  format: PageFormat;
  paperStyle: PaperStyle;
  activities: string[];
  colorMode: ColorMode;
  theme: Theme;
  title: string;
  lineColor: string;
  lineThickness: number;
  marginPreset: MarginPreset;
  margins: Margins;
  tracingStyle: TracingStyle;
  workbook: Workbook;

  setStep: (s: WizardStep) => void;
  next: () => void;
  prev: () => void;
  setProductType: (t: ProductType) => void;
  setChild: (c: Partial<ChildProfile>) => void;
  setFormat: (f: PageFormat) => void;
  setPaperStyle: (p: PaperStyle) => void;
  toggleActivity: (a: string) => void;
  setColorMode: (m: ColorMode) => void;
  setTheme: (t: Theme) => void;
  setTitle: (t: string) => void;
  setLineColor: (c: string) => void;
  setLineThickness: (n: number) => void;
  setMarginPreset: (p: MarginPreset) => void;
  setMargins: (m: Margins) => void;
  setTracingStyle: (s: TracingStyle) => void;
  setPhoto: (p: ChildPhoto | undefined) => void;
  applyAgePreset: (presetId: string) => void;
  rebuildPages: () => void;
  reset: () => void;
}

const DEFAULT: Pick<
  WizardState,
  | "step"
  | "productType"
  | "child"
  | "format"
  | "paperStyle"
  | "activities"
  | "colorMode"
  | "theme"
  | "title"
  | "lineColor"
  | "lineThickness"
  | "marginPreset"
  | "margins"
  | "tracingStyle"
> = {
  step: "type",
  productType: "name-book",
  child: { name: "Tudor", age: 5, level: "beginner" },
  format: "A4",
  paperStyle: "tracing-lines",
  activities: ["name-tracing", "letter-tracing"],
  colorMode: "color",
  theme: "minimalist",
  title: "My First Tracing Workbook",
  lineColor: "#9aa3a8",
  lineThickness: 1.0,
  marginPreset: "normal",
  margins: PAGE_SIZES.A4.defaultMargins,
  tracingStyle: "dotted",
};

export const useWizard = create<WizardState>()(
  persist(
    (set, get) => ({
      ...DEFAULT,
      workbook: newWorkbook({ title: DEFAULT.title, child: DEFAULT.child }),

      setStep: (step) => set({ step }),
      next: () => {
        const i = STEP_ORDER.indexOf(get().step);
        if (i < STEP_ORDER.length - 1) {
          set({ step: STEP_ORDER[i + 1] });
          get().rebuildPages();
        }
      },
      prev: () => {
        const i = STEP_ORDER.indexOf(get().step);
        if (i > 0) set({ step: STEP_ORDER[i - 1] });
      },
      setProductType: (productType) => {
        set({ productType });
        get().rebuildPages();
      },
      setChild: (c) => {
        set({ child: { ...get().child, ...c } });
        get().rebuildPages();
      },
      setFormat: (format) => {
        // Re-apply default margins for this format and rebuild so paper size flows everywhere.
        const margins = PAGE_SIZES[format].defaultMargins;
        set({ format, margins });
        get().rebuildPages();
      },
      setPhoto: (photo) => {
        set({ child: { ...get().child, photo } });
        get().rebuildPages();
      },
      applyAgePreset: (presetId) => {
        // Lazy-import to avoid circular module ordering issues during SSR
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getAgePresetById } = require("./age-presets") as typeof import("./age-presets");
        const preset = getAgePresetById(presetId);
        if (!preset) return;
        set({
          productType: "custom-book",
          activities: [...preset.activities],
          paperStyle: preset.paperStyle,
          theme: preset.theme,
        });
        get().rebuildPages();
      },
      setPaperStyle: (paperStyle) => {
        set({ paperStyle });
        get().rebuildPages();
      },
      toggleActivity: (a) => {
        const cur = get().activities;
        const next = cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a];
        set({ activities: next });
        get().rebuildPages();
      },
      setColorMode: (colorMode) => { set({ colorMode }); get().rebuildPages(); },
      setTheme: (theme) => { set({ theme }); get().rebuildPages(); },
      setTitle: (title) => { set({ title }); get().rebuildPages(); },
      setLineColor: (lineColor) => { set({ lineColor }); get().rebuildPages(); },
      setLineThickness: (lineThickness) => { set({ lineThickness }); get().rebuildPages(); },
      setMarginPreset: (marginPreset) => {
        const s = get();
        const base = PAGE_SIZES[s.format].defaultMargins;
        const margins =
          marginPreset === "narrow"
            ? scaleMargins(base, 0.65)
            : marginPreset === "wide"
            ? scaleMargins(base, 1.45)
            : marginPreset === "normal"
            ? base
            : s.margins;
        set({ marginPreset, margins });
      },
      setMargins: (margins) => { set({ margins, marginPreset: "custom" }); get().rebuildPages(); },
      setTracingStyle: (tracingStyle) => { set({ tracingStyle }); get().rebuildPages(); },
      rebuildPages: () => {
        const s = get();
        const pages = buildPages({
          productType: s.productType,
          child: s.child,
          paperStyle: s.paperStyle,
          selectedActivities: s.activities,
        });
        const baseMargins =
          s.marginPreset === "custom" ? s.margins : PAGE_SIZES[s.format].defaultMargins;
        const margins =
          s.marginPreset === "narrow"
            ? scaleMargins(baseMargins, 0.65)
            : s.marginPreset === "wide"
            ? scaleMargins(baseMargins, 1.45)
            : baseMargins;
        set({
          margins,
          workbook: {
            ...s.workbook,
            title: s.title,
            child: s.child,
            format: s.format,
            colorMode: s.colorMode,
            theme: s.theme,
            lineColor: s.lineColor,
            lineThickness: s.lineThickness,
            tracingStyle: s.tracingStyle,
            marginPreset: s.marginPreset,
            margins,
            pages,
            meta: { ...s.workbook.meta, updatedAt: new Date().toISOString() },
          },
        });
      },
      reset: () =>
        set({
          ...DEFAULT,
          workbook: newWorkbook({ title: DEFAULT.title, child: DEFAULT.child }),
        }),
    }),
    {
      name: "workbook-studio:wizard",
      partialize: (s) => ({
        productType: s.productType,
        child: s.child,
        format: s.format,
        paperStyle: s.paperStyle,
        activities: s.activities,
        colorMode: s.colorMode,
        theme: s.theme,
        title: s.title,
        lineColor: s.lineColor,
        lineThickness: s.lineThickness,
        marginPreset: s.marginPreset,
        margins: s.margins,
        tracingStyle: s.tracingStyle,
      }),
    }
  )
);

function scaleMargins(m: Margins, factor: number): Margins {
  return {
    top: Math.round(m.top * factor * 10) / 10,
    right: Math.round(m.right * factor * 10) / 10,
    bottom: Math.round(m.bottom * factor * 10) / 10,
    left: Math.round(m.left * factor * 10) / 10,
  };
}

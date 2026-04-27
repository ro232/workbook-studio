import type { PageFormat, Margins } from "@/types/workbook";

export interface PageDimensions {
  width: number;
  height: number;
  label: string;
  description: string;
  /** Default content margins in mm, tuned per format */
  defaultMargins: Margins;
  /** Hard print-safe area in mm — printers can't reach closer than this */
  printSafe: Margins;
}

export const PAGE_SIZES: Record<PageFormat, PageDimensions> = {
  A4: {
    width: 210,
    height: 297,
    label: "A4",
    description: "210 × 297 mm — most common",
    defaultMargins: { top: 18, right: 16, bottom: 18, left: 16 },
    printSafe: { top: 8, right: 8, bottom: 8, left: 8 },
  },
  A5: {
    width: 148,
    height: 210,
    label: "A5",
    description: "148 × 210 mm — pocket size",
    defaultMargins: { top: 14, right: 12, bottom: 14, left: 12 },
    printSafe: { top: 6, right: 6, bottom: 6, left: 6 },
  },
  A2: {
    width: 420,
    height: 594,
    label: "A2",
    description: "420 × 594 mm — poster size",
    defaultMargins: { top: 28, right: 24, bottom: 28, left: 24 },
    printSafe: { top: 12, right: 12, bottom: 12, left: 12 },
  },
  Letter: {
    width: 215.9,
    height: 279.4,
    label: "US Letter",
    description: "8.5 × 11 in — US standard",
    defaultMargins: { top: 19, right: 16, bottom: 19, left: 16 },
    printSafe: { top: 6.35, right: 6.35, bottom: 6.35, left: 6.35 },
  },
};

export function getPageDimensions(format: PageFormat): PageDimensions {
  return PAGE_SIZES[format];
}

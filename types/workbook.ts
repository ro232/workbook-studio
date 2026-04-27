export type PageFormat = "A4" | "A5" | "A2" | "Letter";

export type PaperStyle =
  | "blank"
  | "dictando"
  | "math"
  | "dotted"
  | "drawing"
  | "handwriting"
  | "tracing-lines";

export type ColorMode = "color" | "bw";

export type ActivityType =
  | "cover"
  | "name-tracing"
  | "letter-tracing"
  | "number-tracing"
  | "shape-tracing"
  | "word-tracing"
  | "handwriting-3line"
  | "coloring"
  | "color-letter"
  | "color-number"
  | "color-shape"
  | "connect-dots"
  | "blank"
  | "free-write";

export type Theme = "minimalist" | "animals" | "space" | "princess";

export type FontFamily = "trace" | "sans" | "display";

export interface PhotoCrop {
  /** All values in % of the original image, 0-100 */
  x: number;
  y: number;
  width: number;
  height: number;
  /** zoom 1.0 = fit; aspect 1 = square */
  zoom: number;
  shape: "circle" | "rounded" | "square";
}

export interface ChildPhoto {
  /** base64 data URL of the original (or cropped) image */
  dataUrl: string;
  crop: PhotoCrop;
}

export interface ChildProfile {
  name: string;
  age?: number;
  level?: "beginner" | "intermediate" | "advanced";
  photo?: ChildPhoto;
}

export interface PageConfig {
  id: string;
  type: ActivityType;
  paperStyle: PaperStyle;
  data: Record<string, unknown>;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Workbook {
  id: string;
  title: string;
  child: ChildProfile;
  format: PageFormat;
  colorMode: ColorMode;
  theme: Theme;
  fontFamily: FontFamily;
  lineColor: string;
  lineThickness: number;
  margins: Margins;
  pages: PageConfig[];
  branding?: {
    kindergartenName?: string;
    educatorName?: string;
  };
  meta: { createdAt: string; updatedAt: string };
}

export type ProductType =
  | "single"
  | "alphabet-book"
  | "alphabet-book-ro"
  | "numbers-book"
  | "name-book"
  | "shapes-book"
  | "handwriting-ro"
  | "custom-book";

export interface BatchOptions {
  preset: ProductType;
  pageCount?: number;
  includeCover: boolean;
  includeReinforcement: boolean;
}

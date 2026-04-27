import type { ActivityType, ProductType } from "@/types/workbook";

export interface ActivityMeta {
  id: ActivityType;
  label: string;
  description: string;
  icon: string;
}

export const ACTIVITIES: ActivityMeta[] = [
  { id: "name-tracing", label: "Name Tracing", icon: "PenLine", description: "Trace your child's name in dotted letters." },
  { id: "letter-tracing", label: "Letters A–Z", icon: "Type", description: "Practice uppercase and lowercase letters." },
  { id: "number-tracing", label: "Numbers 0–9", icon: "Hash", description: "Trace and learn numbers 0 through 9." },
  { id: "shape-tracing", label: "Shapes", icon: "Shapes", description: "Trace circles, squares, triangles, stars." },
  { id: "handwriting-3line", label: "Handwriting (3-line)", icon: "AlignLeft", description: "School-style 3-line guides for handwriting practice." },
  { id: "color-letter", label: "Color the Letter", icon: "Palette", description: "Outlined letters for coloring practice." },
  { id: "color-number", label: "Color the Number", icon: "Palette", description: "Outlined numbers for coloring practice." },
  { id: "color-shape", label: "Shape Coloring", icon: "Palette", description: "Outlined shapes ready to be colored." },
  { id: "connect-dots", label: "Connect the Dots", icon: "Dot", description: "Numbered dots that form a hidden picture." },
  { id: "coloring", label: "Free Coloring", icon: "Palette", description: "Open coloring pages with simple line art." },
  { id: "blank", label: "Blank Page", icon: "Square", description: "Free space — paper style of your choice." },
  { id: "free-write", label: "Free Writing", icon: "Edit3", description: "Open writing area with prompts." },
];

export interface ProductTypeMeta {
  id: ProductType;
  label: string;
  description: string;
  pageCount: string;
  emoji: string;
}

export const PRODUCT_TYPES: ProductTypeMeta[] = [
  { id: "single", label: "Single Worksheet", description: "One personalized printable page.", pageCount: "1 page", emoji: "📄" },
  { id: "name-book", label: "Name Tracing Book", description: "Personalized book focused on your child's name.", pageCount: "8–16 pages", emoji: "✍️" },
  { id: "alphabet-book", label: "Alphabet Book", description: "Full A–Z workbook with cover.", pageCount: "26 + cover", emoji: "🔤" },
  { id: "alphabet-book-ro", label: "Alfabetul românesc", description: "Litere românești cu Ă, Â, Î, Ș, Ț.", pageCount: "31 + copertă", emoji: "🇷🇴" },
  { id: "numbers-book", label: "Numbers Book", description: "Numbers 0–9 with tracing practice.", pageCount: "10 + cover", emoji: "🔢" },
  { id: "shapes-book", label: "Shapes Book", description: "Geometric shapes with names and tracing.", pageCount: "8 + cover", emoji: "⭐" },
  { id: "handwriting-ro", label: "Caligrafie românească", description: "Cuvinte românești pe 3 linii — stil de caiet de școală.", pageCount: "10 + copertă", emoji: "📝" },
  { id: "custom-book", label: "Custom Workbook", description: "Mix activities, format, and length yourself.", pageCount: "Up to 50", emoji: "🎨" },
];

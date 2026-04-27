import type { Workbook, PageConfig } from "@/types/workbook";
import { getPageDimensions } from "@/lib/page-sizes";
import { PaperBackground } from "./PaperBackground";
import { CoverTemplate } from "./CoverTemplate";
import { TracingTemplate } from "./TracingTemplate";
import { ShapeTemplate } from "./ShapeTemplate";
import { BlankTemplate } from "./BlankTemplate";
import { HandwritingTemplate } from "./HandwritingTemplate";
import { ColoringTemplate } from "./ColoringTemplate";
import { ConnectDotsTemplate } from "./ConnectDotsTemplate";

interface Props {
  page: PageConfig;
  workbook: Workbook;
  pageIndex: number;
  totalPages: number;
  showSafeArea?: boolean;
}

export function PageRenderer({ page, workbook, pageIndex, totalPages, showSafeArea }: Props) {
  const dim = getPageDimensions(workbook.format);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${dim.width} ${dim.height}`}
      width={`${dim.width}mm`}
      height={`${dim.height}mm`}
      preserveAspectRatio="xMidYMid meet"
      style={{ background: "#ffffff", display: "block" }}
    >
      <rect width={dim.width} height={dim.height} fill="#ffffff" />

      {/* Paper style background (lines/grids/dots) - skipped on cover/coloring */}
      {page.type !== "cover" &&
        page.type !== "color-letter" &&
        page.type !== "color-number" &&
        page.type !== "color-shape" &&
        page.type !== "coloring" &&
        page.type !== "connect-dots" &&
        page.type !== "handwriting-3line" && (
          <PaperBackground
            style={page.paperStyle}
            width={dim.width}
            height={dim.height}
            margins={workbook.margins}
            colorMode={workbook.colorMode}
            thickness={workbook.lineThickness ?? 1}
          />
        )}

      {/* Activity content */}
      {page.type === "cover" && (
        <CoverTemplate workbook={workbook} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {(page.type === "name-tracing" ||
        page.type === "letter-tracing" ||
        page.type === "number-tracing" ||
        page.type === "word-tracing") && (
        <TracingTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {page.type === "shape-tracing" && (
        <ShapeTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {page.type === "handwriting-3line" && (
        <HandwritingTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {(page.type === "color-letter" ||
        page.type === "color-number" ||
        page.type === "color-shape" ||
        page.type === "coloring") && (
        <ColoringTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {page.type === "connect-dots" && (
        <ConnectDotsTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}
      {(page.type === "blank" || page.type === "free-write") && (
        <BlankTemplate workbook={workbook} page={page} pageWidth={dim.width} pageHeight={dim.height} />
      )}

      {/* Print-safe area indicator (preview-only) */}
      {showSafeArea && (
        <rect
          x={dim.printSafe.left}
          y={dim.printSafe.top}
          width={dim.width - dim.printSafe.left - dim.printSafe.right}
          height={dim.height - dim.printSafe.top - dim.printSafe.bottom}
          fill="none"
          stroke="#2f6b5e"
          strokeWidth={0.25}
          strokeDasharray="2,2"
          opacity={0.5}
        />
      )}

      {/* Footer page number (skip cover) */}
      {page.type !== "cover" && pageIndex > 0 && (
        <text
          x={dim.width / 2}
          y={dim.height - Math.max(4, dim.printSafe.bottom * 0.7)}
          textAnchor="middle"
          fontFamily="Quicksand, sans-serif"
          fontSize={dim.width > 300 ? 4.4 : 3.2}
          fill="#9a9a9a"
        >
          {pageIndex} / {totalPages - 1}
        </text>
      )}
    </svg>
  );
}

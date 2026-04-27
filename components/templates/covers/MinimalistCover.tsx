import type { Workbook } from "@/types/workbook";
import { PhotoFrame } from "./PhotoFrame";
import { fitTitle } from "./title-fit";

interface Props {
  workbook: Workbook;
  pageWidth: number;
  pageHeight: number;
}

export function MinimalistCover({ workbook, pageWidth, pageHeight }: Props) {
  const { title, child, colorMode } = workbook;
  const bg = "#fafaf7";
  const accent = colorMode === "bw" ? "#1a1a1a" : "#2f6b5e";
  const ink = "#1a1a1a";
  const soft = colorMode === "bw" ? "#f0f0f0" : "#e6f0ec";

  return (
    <g>
      <rect width={pageWidth} height={pageHeight} fill={bg} />
      <rect x={0} y={0} width={pageWidth} height={pageHeight * 0.18} fill={soft} />
      {/* Frame */}
      <rect
        x={pageWidth * 0.08}
        y={pageHeight * 0.08}
        width={pageWidth * 0.84}
        height={pageHeight * 0.84}
        fill="none"
        stroke={accent}
        strokeWidth={0.5}
        rx={4}
      />

      {child.photo ? (
        <PhotoFrame
          photo={child.photo}
          cx={pageWidth / 2}
          cy={pageHeight * 0.32}
          size={Math.min(pageWidth * 0.32, 60)}
          borderColor={accent}
          borderWidth={0.6}
        />
      ) : (
        [0.18, 0.22, 0.26].map((y, i) => (
          <circle
            key={i}
            cx={pageWidth * 0.5}
            cy={pageHeight * y}
            r={0.6 + i * 0.3}
            fill={accent}
            opacity={0.6 - i * 0.15}
          />
        ))
      )}

      <text
        x={pageWidth / 2}
        y={pageHeight * (child.photo ? 0.5 : 0.4)}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3.6}
        fontWeight={500}
        fill={accent}
        letterSpacing={2.4}
      >
        WORKBOOK STUDIO
      </text>

      <text
        x={pageWidth / 2}
        y={pageHeight * (child.photo ? 0.58 : 0.5)}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize={fitTitle(title, pageWidth, 0.07, 0.04)}
        fontWeight={600}
        fill={ink}
      >
        {title}
      </text>

      <line
        x1={pageWidth * 0.35}
        y1={pageHeight * (child.photo ? 0.63 : 0.55)}
        x2={pageWidth * 0.65}
        y2={pageHeight * (child.photo ? 0.63 : 0.55)}
        stroke={accent}
        strokeWidth={0.4}
      />

      <text
        x={pageWidth / 2}
        y={pageHeight * (child.photo ? 0.74 : 0.66)}
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize={pageWidth * 0.12}
        fill={accent}
      >
        {child.name || "—"}
      </text>

      {child.age && (
        <text
          x={pageWidth / 2}
          y={pageHeight * (child.photo ? 0.81 : 0.73)}
          textAnchor="middle"
          fontFamily="Quicksand, sans-serif"
          fontSize={4.5}
          fill={ink}
          opacity={0.7}
        >
          age {child.age}
        </text>
      )}

      <text
        x={pageWidth / 2}
        y={pageHeight * 0.93}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3}
        fill={ink}
        opacity={0.45}
        letterSpacing={1.5}
      >
        A PERSONAL WORKBOOK · {workbook.format}
      </text>
    </g>
  );
}

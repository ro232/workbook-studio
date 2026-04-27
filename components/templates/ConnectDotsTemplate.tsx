import type { Workbook, PageConfig } from "@/types/workbook";

interface Dot {
  x: number; // 0-100, percent of canvas
  y: number; // 0-100
  n: number;
}

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

export function ConnectDotsTemplate({ workbook, page, pageWidth, pageHeight }: Props) {
  const { margins } = workbook;
  const cw = pageWidth - margins.left - margins.right;
  const ch = pageHeight - margins.top - margins.bottom;
  const accent = "#2f6b5e";
  const dots = (page.data.dots as Dot[]) ?? [];
  const name = String(page.data.name ?? "Mystery shape");

  // Centered drawing area
  const headerHeight = 30;
  const drawTop = margins.top + headerHeight;
  const drawHeight = ch - headerHeight - 20;
  const drawWidth = cw;
  const size = Math.min(drawWidth, drawHeight);
  const xOffset = margins.left + (drawWidth - size) / 2;
  const yOffset = drawTop + (drawHeight - size) / 2;

  return (
    <g>
      {/* Header */}
      <text
        x={margins.left}
        y={margins.top + 6}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.2}
        fill={accent}
        letterSpacing={1.8}
      >
        CONNECT THE DOTS
      </text>
      <line x1={margins.left} y1={margins.top + 9} x2={margins.left + 30} y2={margins.top + 9} stroke={accent} strokeWidth={0.5} />
      <text
        x={margins.left}
        y={margins.top + 16}
        fontFamily="Fraunces, serif"
        fontSize={7}
        fontWeight={600}
        fill="#1a1a1a"
      >
        Connect the dots — what do you see?
      </text>
      <text
        x={margins.left}
        y={margins.top + 22}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.4}
        fill="#7a7a7a"
      >
        Start at 1 and follow the numbers in order.
      </text>

      {/* Dots */}
      {dots.map((d, i) => {
        const x = xOffset + (d.x / 100) * size;
        const y = yOffset + (d.y / 100) * size;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={1.2} fill="#1a1a1a" />
            <text
              x={x + 2.4}
              y={y - 1.2}
              fontFamily="Quicksand, sans-serif"
              fontSize={3.2}
              fontWeight={600}
              fill={accent}
            >
              {d.n}
            </text>
          </g>
        );
      })}

      {/* Hint at bottom */}
      <text
        x={pageWidth / 2}
        y={pageHeight - margins.bottom - 6}
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize={4.2}
        fill="#aaaaaa"
      >
        Hint: it&apos;s a {name.toLowerCase()}!
      </text>
    </g>
  );
}

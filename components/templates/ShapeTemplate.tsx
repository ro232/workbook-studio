import type { Workbook, PageConfig } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

function ShapePath({ shape, cx, cy, size, traced }: { shape: string; cx: number; cy: number; size: number; traced: boolean }) {
  const stroke = traced ? "#9bb5ad" : "#2f6b5e";
  const strokeWidth = traced ? 0.5 : 0.8;
  const dash = traced ? "1.5,1.2" : "0";

  switch (shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={size / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    case "square":
      return <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    case "rectangle":
      return <rect x={cx - size * 0.6} y={cy - size * 0.4} width={size * 1.2} height={size * 0.8} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    case "triangle":
      return (
        <polygon
          points={`${cx},${cy - size / 2} ${cx + size / 2},${cy + size / 2} ${cx - size / 2},${cy + size / 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
        />
      );
    case "star": {
      const r1 = size / 2;
      const r2 = size / 4.5;
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
      }
      return <polygon points={points.join(" ")} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    }
    case "heart": {
      const s = size / 2;
      const d = `M ${cx} ${cy + s * 0.6}
                 C ${cx - s * 1.2} ${cy - s * 0.2}, ${cx - s * 0.8} ${cy - s}, ${cx} ${cy - s * 0.3}
                 C ${cx + s * 0.8} ${cy - s}, ${cx + s * 1.2} ${cy - s * 0.2}, ${cx} ${cy + s * 0.6} Z`;
      return <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    }
    default:
      return null;
  }
}

export function ShapeTemplate({ workbook, page, pageWidth }: Props) {
  const { margins } = workbook;
  const cw = pageWidth - margins.left - margins.right;
  const shape = String(page.data.shape || "circle");

  return (
    <g>
      {/* Title */}
      <text
        x={margins.left}
        y={margins.top + 6}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.2}
        fill="#2f6b5e"
        letterSpacing={1.8}
      >
        SHAPES
      </text>
      <line x1={margins.left} y1={margins.top + 9} x2={margins.left + 30} y2={margins.top + 9} stroke="#2f6b5e" strokeWidth={0.5} />
      <text
        x={margins.left}
        y={margins.top + 16}
        fontFamily="Fraunces, serif"
        fontSize={7}
        fontWeight={600}
        fill="#1a1a1a"
      >
        Trace the {shape}
      </text>

      {/* Reference shape - large */}
      <ShapePath shape={shape} cx={pageWidth / 2} cy={margins.top + 50} size={50} traced={false} />
      <text
        x={pageWidth / 2}
        y={margins.top + 85}
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize={9}
        fill="#2f6b5e"
      >
        {shape.charAt(0).toUpperCase() + shape.slice(1)}
      </text>

      {/* Practice grid 2x3 */}
      {Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cellW = cw / 3;
        const cx = margins.left + col * cellW + cellW / 2;
        const cy = margins.top + 110 + row * 50;
        return (
          <g key={i}>
            <ShapePath shape={shape} cx={cx} cy={cy} size={28} traced={true} />
          </g>
        );
      })}
    </g>
  );
}

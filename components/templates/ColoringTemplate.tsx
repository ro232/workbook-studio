import type { Workbook, PageConfig } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Outlined letter / number / shape that the child can color in.
 * Uses heavy stroke + thin no-fill so the inside is open coloring space.
 */
export function ColoringTemplate({ workbook, page, pageWidth, pageHeight }: Props) {
  const { margins } = workbook;
  const cw = pageWidth - margins.left - margins.right;
  const accent = "#2f6b5e";

  let title = "";
  let subtitle = "";
  let glyph: React.ReactNode = null;

  if (page.type === "color-letter") {
    const letter = String(page.data.letter ?? "A");
    title = `Color the letter ${letter}`;
    subtitle = "Use any colors you like.";
    glyph = (
      <text
        x={pageWidth / 2}
        y={pageHeight / 2 + 30}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight={700}
        fontSize={Math.min(cw * 0.85, 180)}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={1.2}
      >
        {letter}
      </text>
    );
  } else if (page.type === "color-number") {
    const num = String(page.data.number ?? "1");
    title = `Color the number ${num}`;
    subtitle = "How many things can you find that match this number?";
    glyph = (
      <text
        x={pageWidth / 2}
        y={pageHeight / 2 + 30}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight={700}
        fontSize={Math.min(cw * 0.85, 180)}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={1.2}
      >
        {num}
      </text>
    );
  } else if (page.type === "color-shape" || page.type === "coloring") {
    const shape = String(page.data.shape ?? "circle");
    title = `Color the ${shape}`;
    subtitle = "Stay inside the lines.";
    glyph = <ColoringShape shape={shape} cx={pageWidth / 2} cy={pageHeight / 2 + 10} size={Math.min(cw * 0.7, 140)} />;
  }

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
        COLORING
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
        {title}
      </text>
      <text
        x={margins.left}
        y={margins.top + 22}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.4}
        fill="#7a7a7a"
      >
        {subtitle}
      </text>

      {/* Color swatch hint row */}
      <g transform={`translate(${margins.left}, ${margins.top + 28})`}>
        {["#ef4444", "#f59e0b", "#fbbf24", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"].map((c, i) => (
          <circle key={i} cx={4 + i * 6} cy={2} r={2} fill={c} stroke="#222" strokeWidth={0.2} />
        ))}
      </g>

      {/* Glyph */}
      {glyph}
    </g>
  );
}

function ColoringShape({ shape, cx, cy, size }: { shape: string; cx: number; cy: number; size: number }) {
  const stroke = "#1a1a1a";
  const sw = 1.2;

  switch (shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={size / 2} fill="none" stroke={stroke} strokeWidth={sw} />;
    case "square":
      return <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} fill="none" stroke={stroke} strokeWidth={sw} rx={4} />;
    case "triangle":
      return <polygon points={`${cx},${cy - size / 2} ${cx + size / 2},${cy + size / 2} ${cx - size / 2},${cy + size / 2}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case "star": {
      const r1 = size / 2;
      const r2 = size / 4.5;
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
      }
      return <polygon points={points.join(" ")} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    }
    case "heart": {
      const s = size / 2;
      const d = `M ${cx} ${cy + s * 0.6}
                 C ${cx - s * 1.2} ${cy - s * 0.2}, ${cx - s * 0.8} ${cy - s}, ${cx} ${cy - s * 0.3}
                 C ${cx + s * 0.8} ${cy - s}, ${cx + s * 1.2} ${cy - s * 0.2}, ${cx} ${cy + s * 0.6} Z`;
      return <path d={d} fill="none" stroke={stroke} strokeWidth={sw} />;
    }
    default:
      return <circle cx={cx} cy={cy} r={size / 2} fill="none" stroke={stroke} strokeWidth={sw} />;
  }
}

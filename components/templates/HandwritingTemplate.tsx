import type { Workbook, PageConfig } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Romanian school-style 3-line handwriting template.
 * Each row has: topline (auxiliary, light) - midline (dotted, dashed mid-mark) - baseline (solid, primary).
 * A descender guide also drawn faintly below baseline for letters like p, g, j.
 *
 * The first row shows a solid example word.
 * The next 2 rows show the same word in dashed/dotted form for tracing.
 * Remaining rows are blank for free practice.
 */
export function HandwritingTemplate({ workbook, page, pageWidth, pageHeight }: Props) {
  const { margins, colorMode } = workbook;
  const cw = pageWidth - margins.left - margins.right;
  const ch = pageHeight - margins.top - margins.bottom;

  const word = String(page.data.word ?? "mama");
  const rowsConfig = Number(page.data.rows ?? 6);
  const lineSpacing = Number(page.data.lineSpacing ?? 14); // total height of one row group (mm)
  const xHeight = lineSpacing * 0.43; // letter body height (between midline and baseline)

  const baselineColor = colorMode === "bw" ? "#444" : "#5e7873";
  const auxColor = colorMode === "bw" ? "#bcbcbc" : "#bcd0c9";
  const midColor = colorMode === "bw" ? "#888" : "#9bb5ad";
  const accent = colorMode === "bw" ? "#222" : "#2f6b5e";

  const headerHeight = 26;
  const rowsAreaTop = margins.top + headerHeight;
  const availableRows = Math.min(rowsConfig, Math.floor((ch - headerHeight) / lineSpacing));

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
        HANDWRITING — 3-LINE GUIDES
      </text>
      <line x1={margins.left} y1={margins.top + 9} x2={margins.left + 30} y2={margins.top + 9} stroke={accent} strokeWidth={0.5} />
      <text
        x={margins.left}
        y={margins.top + 16}
        fontFamily="Fraunces, serif"
        fontSize={7}
        fontWeight={600}
        fill={colorMode === "bw" ? "#1a1a1a" : "#1a1a1a"}
      >
        Trace and write — &quot;{word}&quot;
      </text>
      <text
        x={margins.left}
        y={margins.top + 22}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.4}
        fill="#7a7a7a"
      >
        Start at the green dot. Stay between the lines.
      </text>

      {/* Row groups */}
      {Array.from({ length: availableRows }, (_, i) => {
        const top = rowsAreaTop + i * lineSpacing + 2; // top auxiliary line y
        const mid = top + xHeight * 0.6;               // midline (dashed)
        const base = top + xHeight * 1.4;              // baseline (solid)
        const desc = base + xHeight * 0.55;            // descender guide

        const isExample = i === 0;
        const isTracing = i >= 1 && i <= 2;

        return (
          <g key={i}>
            {/* Topline (light auxiliary) */}
            <line x1={margins.left} y1={top} x2={margins.left + cw} y2={top} stroke={auxColor} strokeWidth={0.18} />
            {/* Midline (dashed) */}
            <line
              x1={margins.left}
              y1={mid}
              x2={margins.left + cw}
              y2={mid}
              stroke={midColor}
              strokeWidth={0.18}
              strokeDasharray="1.3,1.3"
            />
            {/* Baseline (primary, solid) */}
            <line x1={margins.left} y1={base} x2={margins.left + cw} y2={base} stroke={baselineColor} strokeWidth={0.32} />
            {/* Descender guide */}
            <line
              x1={margins.left}
              y1={desc}
              x2={margins.left + cw}
              y2={desc}
              stroke={auxColor}
              strokeWidth={0.14}
              strokeDasharray="0.6,1.2"
            />

            {/* Row marker (left margin number) */}
            <text
              x={margins.left - 4}
              y={base}
              textAnchor="end"
              fontFamily="Quicksand, sans-serif"
              fontSize={2.6}
              fill="#a0a0a0"
            >
              {i + 1}
            </text>

            {/* Start dot at line beginning for guided rows */}
            {(isExample || isTracing) && (
              <circle cx={margins.left + 1.8} cy={base} r={0.7} fill={accent} />
            )}

            {/* Example word: solid */}
            {isExample && (
              <text
                x={margins.left + 4}
                y={base - 0.5}
                fontFamily="Patrick Hand, cursive"
                fontSize={xHeight * 1.7}
                fill={accent}
                letterSpacing={1.5}
              >
                {word}
              </text>
            )}
            {/* Tracing rows: dashed */}
            {isTracing && (
              <text
                x={margins.left + 4}
                y={base - 0.5}
                fontFamily="Patrick Hand, cursive"
                fontSize={xHeight * 1.7}
                fill="none"
                stroke={midColor}
                strokeWidth={0.45}
                strokeDasharray="1.5,1.2"
                letterSpacing={1.5}
              >
                {word}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

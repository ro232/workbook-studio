import type { Workbook, PageConfig, TracingStyle } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Stroke calibration per tracing style.
 * Returns the props to apply to a tracing-letter <text> element.
 */
function tracingStyleProps(
  style: TracingStyle,
  thickness: number,
  color: string
): Partial<{ stroke: string; fill: string; strokeWidth: number; strokeDasharray: string; strokeLinecap: "round" | "butt"; strokeLinejoin: "round" | "miter" }> {
  // thickness multiplier (1.0 = baseline)
  const t = Math.max(0.4, Math.min(2.0, thickness));
  switch (style) {
    case "dotted":
      // Round dots — small dash, equal gap, rounded caps so dashes look like circles
      return {
        fill: "none",
        stroke: color,
        strokeWidth: 0.6 * t,
        strokeDasharray: "0.1 1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
    case "dashed":
      // Longer dashes — classic tracing-school look
      return {
        fill: "none",
        stroke: color,
        strokeWidth: 0.5 * t,
        strokeDasharray: "1.6 1.4",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
    case "outline":
      // Hollow letter — child fills it in with crayons or pen
      return {
        fill: "none",
        stroke: color,
        strokeWidth: 0.7 * t,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
    case "arrow":
      // Same as dashed but with directional emphasis (rendered separately by the row)
      return {
        fill: "none",
        stroke: color,
        strokeWidth: 0.5 * t,
        strokeDasharray: "2.2 1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
  }
}

export function TracingTemplate({ workbook, page, pageWidth }: Props) {
  const { margins, colorMode, tracingStyle, lineThickness } = workbook;
  const cw = pageWidth - margins.left - margins.right;

  const traceInk = colorMode === "bw" ? "#888" : "#9bb5ad";
  const titleInk = colorMode === "bw" ? "#222" : "#2f6b5e";
  const accent = colorMode === "bw" ? "#444" : "#2f6b5e";

  let title = "";
  let traceText = "";
  let subtitle = "";

  if (page.type === "name-tracing") {
    const name = String(page.data.name || "Friend");
    title = "Trace your name";
    traceText = name;
    subtitle = `Practice writing ${name}`;
  } else if (page.type === "letter-tracing") {
    const letter = String(page.data.letter || "A");
    title = `The letter ${letter}`;
    traceText = `${letter} ${letter.toLowerCase()} ${letter} ${letter.toLowerCase()}`;
    subtitle = `Trace the letter ${letter} — uppercase and lowercase`;
  } else if (page.type === "number-tracing") {
    const num = String(page.data.number ?? "1");
    title = `The number ${num}`;
    traceText = `${num} ${num} ${num} ${num} ${num}`;
    subtitle = `Trace the number ${num} four times`;
  } else if (page.type === "word-tracing") {
    const word = String(page.data.word || "Hello");
    title = `Trace the word`;
    traceText = word;
    subtitle = word;
  }

  const repetitions = Number(page.data.repetitions ?? 4);
  const exampleY = margins.top + 30;
  const traceProps = tracingStyleProps(tracingStyle ?? "dotted", lineThickness ?? 1, traceInk);
  const showArrow = (tracingStyle ?? "dotted") === "arrow";

  return (
    <g>
      {/* Title bar */}
      <text
        x={margins.left}
        y={margins.top + 6}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.2}
        fill={accent}
        letterSpacing={1.8}
      >
        {title.toUpperCase()}
      </text>

      <line
        x1={margins.left}
        y1={margins.top + 9}
        x2={margins.left + 30}
        y2={margins.top + 9}
        stroke={accent}
        strokeWidth={0.5}
      />

      <text
        x={margins.left}
        y={margins.top + 16}
        fontFamily="Fraunces, serif"
        fontSize={7}
        fontWeight={600}
        fill={titleInk}
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

      {/* Big example glyph (solid) for letter/number */}
      {(page.type === "letter-tracing" || page.type === "number-tracing") && (
        <text
          x={pageWidth / 2}
          y={exampleY + 25}
          textAnchor="middle"
          fontFamily="Quicksand, sans-serif"
          fontSize={50}
          fontWeight={600}
          fill={titleInk}
        >
          {String(page.data.letter || page.data.number || "")}
        </text>
      )}

      {/* Tracing rows: 3-line guides + dashed/dotted/outline letter */}
      {Array.from({ length: repetitions }, (_, i) => {
        const rowY = (page.type === "letter-tracing" || page.type === "number-tracing")
          ? exampleY + 50 + i * 28
          : margins.top + 35 + i * 28;
        return (
          <g key={i}>
            <line x1={margins.left} y1={rowY} x2={margins.left + cw} y2={rowY} stroke="#d8d8d8" strokeWidth={0.18 * lineThickness} />
            <line
              x1={margins.left}
              y1={rowY + 8}
              x2={margins.left + cw}
              y2={rowY + 8}
              stroke="#bcbcbc"
              strokeWidth={0.18 * lineThickness}
              strokeDasharray="1.2,1.2"
            />
            <line x1={margins.left} y1={rowY + 16} x2={margins.left + cw} y2={rowY + 16} stroke="#888" strokeWidth={0.3 * lineThickness} />
            <text
              x={margins.left + 4}
              y={rowY + 15}
              fontFamily="Patrick Hand, cursive"
              fontSize={16}
              letterSpacing={3}
              {...traceProps}
            >
              {traceText}
            </text>
            {/* Start dot */}
            <circle cx={margins.left + 1.5} cy={rowY + 16} r={0.9} fill={accent} />
            {/* Optional directional arrow above the row when in arrow mode */}
            {showArrow && (
              <g>
                <line
                  x1={margins.left + 4}
                  y1={rowY - 2.5}
                  x2={margins.left + 14}
                  y2={rowY - 2.5}
                  stroke={accent}
                  strokeWidth={0.4}
                />
                <polygon
                  points={`${margins.left + 14},${rowY - 2.5} ${margins.left + 12},${rowY - 3.7} ${margins.left + 12},${rowY - 1.3}`}
                  fill={accent}
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

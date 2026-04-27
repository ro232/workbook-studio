import type { Workbook, PageConfig } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

export function TracingTemplate({ workbook, page, pageWidth, pageHeight }: Props) {
  const { margins, colorMode } = workbook;
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

  // Big example glyph at top
  const exampleY = margins.top + 30;

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

      {/* Big example - solid for reference */}
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

      {/* Tracing rows: 3-line guides + dashed letter */}
      {Array.from({ length: repetitions }, (_, i) => {
        const rowY = (page.type === "letter-tracing" || page.type === "number-tracing")
          ? exampleY + 50 + i * 28
          : margins.top + 35 + i * 28;
        return (
          <g key={i}>
            {/* Top guide */}
            <line
              x1={margins.left}
              y1={rowY}
              x2={margins.left + cw}
              y2={rowY}
              stroke="#d8d8d8"
              strokeWidth={0.18}
            />
            {/* Mid guide (dashed) */}
            <line
              x1={margins.left}
              y1={rowY + 8}
              x2={margins.left + cw}
              y2={rowY + 8}
              stroke="#bcbcbc"
              strokeWidth={0.18}
              strokeDasharray="1.2,1.2"
            />
            {/* Baseline */}
            <line
              x1={margins.left}
              y1={rowY + 16}
              x2={margins.left + cw}
              y2={rowY + 16}
              stroke="#888"
              strokeWidth={0.3}
            />
            {/* Tracing letters - dashed outline style */}
            <text
              x={margins.left + 4}
              y={rowY + 15}
              fontFamily="Patrick Hand, cursive"
              fontSize={16}
              fill="none"
              stroke={traceInk}
              strokeWidth={0.4}
              strokeDasharray="1.5,1.2"
              letterSpacing={3}
            >
              {traceText}
            </text>
            {/* Start dot */}
            <circle
              cx={margins.left + 1.5}
              cy={rowY + 16}
              r={0.8}
              fill={accent}
            />
          </g>
        );
      })}
    </g>
  );
}

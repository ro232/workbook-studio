import type { PaperStyle, ColorMode, Margins } from "@/types/workbook";

interface Props {
  style: PaperStyle;
  width: number;
  height: number;
  margins: Margins;
  colorMode: ColorMode;
  /** Multiplier on baseline stroke widths (default 1.0). */
  thickness?: number;
}

const ink = (mode: ColorMode) => (mode === "bw" ? "#9a9a9a" : "#bcd0c9");
const inkSoft = (mode: ColorMode) => (mode === "bw" ? "#d0d0d0" : "#dde7e3");

export function PaperBackground({ style, width, height, margins, colorMode, thickness = 1 }: Props) {
  const cw = width - margins.left - margins.right;
  const ch = height - margins.top - margins.bottom;
  const x0 = margins.left;
  const y0 = margins.top;
  const c = ink(colorMode);
  const cs = inkSoft(colorMode);
  const t = Math.max(0.4, Math.min(2.0, thickness));

  if (style === "blank" || style === "drawing") return null;

  if (style === "dictando") {
    const lineSpacing = 8;
    const lines = Math.floor(ch / lineSpacing);
    return (
      <g>
        {Array.from({ length: lines }, (_, i) => (
          <line
            key={i}
            x1={x0}
            y1={y0 + (i + 1) * lineSpacing}
            x2={x0 + cw}
            y2={y0 + (i + 1) * lineSpacing}
            stroke={c}
            strokeWidth={0.2 * t}
          />
        ))}
      </g>
    );
  }

  if (style === "math") {
    const grid = 5;
    const cols = Math.floor(cw / grid);
    const rows = Math.floor(ch / grid);
    return (
      <g>
        {Array.from({ length: cols + 1 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={x0 + i * grid}
            y1={y0}
            x2={x0 + i * grid}
            y2={y0 + rows * grid}
            stroke={cs}
            strokeWidth={0.15 * t}
          />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={x0}
            y1={y0 + i * grid}
            x2={x0 + cols * grid}
            y2={y0 + i * grid}
            stroke={cs}
            strokeWidth={0.15 * t}
          />
        ))}
      </g>
    );
  }

  if (style === "dotted") {
    const grid = 5;
    const cols = Math.floor(cw / grid);
    const rows = Math.floor(ch / grid);
    const dots: React.ReactElement[] = [];
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        dots.push(
          <circle
            key={`${i}-${j}`}
            cx={x0 + i * grid}
            cy={y0 + j * grid}
            r={0.3 * t}
            fill={c}
          />
        );
      }
    }
    return <g>{dots}</g>;
  }

  if (style === "handwriting") {
    const groupHeight = 12;
    const groups = Math.floor(ch / groupHeight);
    return (
      <g>
        {Array.from({ length: groups }, (_, i) => {
          const y = y0 + i * groupHeight + 2;
          return (
            <g key={i}>
              <line x1={x0} y1={y} x2={x0 + cw} y2={y} stroke={cs} strokeWidth={0.18 * t} />
              <line
                x1={x0}
                y1={y + 4}
                x2={x0 + cw}
                y2={y + 4}
                stroke={c}
                strokeWidth={0.18 * t}
                strokeDasharray="1.5,1.5"
              />
              <line x1={x0} y1={y + 8} x2={x0 + cw} y2={y + 8} stroke={cs} strokeWidth={0.18 * t} />
            </g>
          );
        })}
      </g>
    );
  }

  if (style === "tracing-lines") {
    return (
      <g>
        {Array.from({ length: Math.floor(ch / 18) }, (_, i) => {
          const y = y0 + i * 18 + 4;
          return (
            <g key={i}>
              <line x1={x0} y1={y} x2={x0 + cw} y2={y} stroke={cs} strokeWidth={0.18 * t} />
              <line x1={x0} y1={y + 6} x2={x0 + cw} y2={y + 6} stroke={c} strokeWidth={0.18 * t} strokeDasharray="1.2,1.2" />
              <line x1={x0} y1={y + 12} x2={x0 + cw} y2={y + 12} stroke={cs} strokeWidth={0.18 * t} />
            </g>
          );
        })}
      </g>
    );
  }

  return null;
}

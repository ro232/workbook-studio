import type { Workbook } from "@/types/workbook";
import { PhotoFrame } from "./PhotoFrame";
import { fitTitle } from "./title-fit";

interface Props {
  workbook: Workbook;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Space theme — deep navy night sky, stars, planet with rings, rocket.
 * Bold sans-serif typography, futuristic feel.
 */
export function SpaceCover({ workbook, pageWidth, pageHeight }: Props) {
  const { title, child, colorMode } = workbook;
  const isBw = colorMode === "bw";
  const bg = isBw ? "#ffffff" : "#0f1735";
  const accent = isBw ? "#1a1a1a" : "#f5d76e";
  const textPrimary = isBw ? "#1a1a1a" : "#ffffff";
  const planet = isBw ? "#444" : "#e07b5b";
  const star = isBw ? "#888" : "#ffffff";
  const ringStroke = isBw ? "#666" : "#a3b8d6";

  const W = pageWidth;
  const H = pageHeight;

  // Deterministic stars (no Math.random for SSR safety)
  const stars = generateStars(W, H, 35);

  return (
    <g>
      <rect width={W} height={H} fill={bg} />

      {/* Stars */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={star} opacity={s.o} />
      ))}

      {/* Sparkle stars (4-point) */}
      <SparkleStar cx={W * 0.15} cy={H * 0.18} size={4} fill={accent} />
      <SparkleStar cx={W * 0.85} cy={H * 0.13} size={5} fill={accent} />
      <SparkleStar cx={W * 0.78} cy={H * 0.78} size={3.5} fill={accent} />

      {/* Planet with rings (top-right area) */}
      <g transform={`translate(${W * 0.78}, ${H * 0.32})`}>
        <ellipse cx={0} cy={0} rx={W * 0.22} ry={W * 0.05} fill="none" stroke={ringStroke} strokeWidth={0.6} />
        <circle cx={0} cy={0} r={W * 0.075} fill={planet} />
        <ellipse cx={-W * 0.025} cy={-W * 0.02} rx={W * 0.025} ry={W * 0.018} fill={isBw ? "#666" : "#c45a3d"} opacity={0.7} />
      </g>

      {/* Rocket (bottom-left area) */}
      <Rocket x={W * 0.18} y={H * 0.78} size={W * 0.16} colorMode={colorMode} />

      {/* Title block */}
      <text
        x={W / 2}
        y={H * 0.12}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3.6}
        fontWeight={500}
        fill={accent}
        letterSpacing={3}
      >
        SPACE EXPLORER · MISSION LOG
      </text>

      <text
        x={W / 2}
        y={H * 0.46}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize={fitTitle(title, W, 0.085, 0.045)}
        fontWeight={700}
        fill={textPrimary}
      >
        {title}
      </text>

      {/* Photo */}
      {child.photo ? (
        <PhotoFrame
          photo={child.photo}
          cx={W / 2}
          cy={H * 0.6}
          size={Math.min(W * 0.36, 70)}
          borderColor={accent}
          borderWidth={1.5}
        />
      ) : (
        <text
          x={W / 2}
          y={H * 0.6}
          textAnchor="middle"
          fontSize={W * 0.16}
          opacity={0.9}
        >
          🚀
        </text>
      )}

      {/* Astronaut name plate */}
      <g>
        <rect
          x={W * 0.2}
          y={H * 0.74}
          width={W * 0.6}
          height={H * 0.09}
          rx={2}
          fill="none"
          stroke={accent}
          strokeWidth={0.6}
        />
        <text
          x={W / 2}
          y={H * 0.785}
          textAnchor="middle"
          fontFamily="Quicksand, sans-serif"
          fontSize={3}
          fill={accent}
          letterSpacing={2.5}
        >
          ASTRONAUT
        </text>
        <text
          x={W / 2}
          y={H * 0.815}
          textAnchor="middle"
          fontFamily="Patrick Hand, cursive"
          fontSize={W * 0.075}
          fill={textPrimary}
        >
          {child.name || "—"}
        </text>
      </g>

      <text
        x={W / 2}
        y={H * 0.93}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3}
        fill={textPrimary}
        opacity={0.55}
        letterSpacing={2}
      >
        AGE {child.age ?? "?"} · WORKBOOK · {workbook.format}
      </text>
    </g>
  );
}

function generateStars(W: number, H: number, count: number) {
  // Deterministic pseudo-random by index
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 9301;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * W,
      y: rand() * H,
      r: 0.4 + rand() * 0.9,
      o: 0.5 + rand() * 0.5,
    });
  }
  return stars;
}

function SparkleStar({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <path
        d={`M 0 -${size} L ${size * 0.25} -${size * 0.25} L ${size} 0 L ${size * 0.25} ${size * 0.25} L 0 ${size} L -${size * 0.25} ${size * 0.25} L -${size} 0 L -${size * 0.25} -${size * 0.25} Z`}
        fill={fill}
      />
    </g>
  );
}

function Rocket({ x, y, size, colorMode }: { x: number; y: number; size: number; colorMode: string }) {
  const isBw = colorMode === "bw";
  const body = isBw ? "#fff" : "#ffffff";
  const stripe = isBw ? "#444" : "#e07b5b";
  const window = isBw ? "#aaa" : "#7ab8d4";
  const flame = isBw ? "#999" : "#f5d76e";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Flame */}
      <path
        d={`M -${size * 0.12} ${size * 0.55} L 0 ${size * 0.95} L ${size * 0.12} ${size * 0.55} Z`}
        fill={flame}
      />
      {/* Body */}
      <path
        d={`M 0 -${size * 0.6} Q ${size * 0.18} -${size * 0.3} ${size * 0.18} 0 L ${size * 0.18} ${size * 0.45} Q ${size * 0.18} ${size * 0.55} ${size * 0.1} ${size * 0.55} L -${size * 0.1} ${size * 0.55} Q -${size * 0.18} ${size * 0.55} -${size * 0.18} ${size * 0.45} L -${size * 0.18} 0 Q -${size * 0.18} -${size * 0.3} 0 -${size * 0.6} Z`}
        fill={body}
        stroke={isBw ? "#1a1a1a" : "transparent"}
        strokeWidth={0.4}
      />
      {/* Stripe */}
      <rect x={-size * 0.18} y={size * 0.05} width={size * 0.36} height={size * 0.1} fill={stripe} />
      {/* Window */}
      <circle cx={0} cy={-size * 0.15} r={size * 0.1} fill={window} stroke={isBw ? "#1a1a1a" : "#fff"} strokeWidth={0.6} />
      {/* Fins */}
      <path d={`M -${size * 0.18} ${size * 0.35} L -${size * 0.32} ${size * 0.55} L -${size * 0.18} ${size * 0.5} Z`} fill={stripe} />
      <path d={`M ${size * 0.18} ${size * 0.35} L ${size * 0.32} ${size * 0.55} L ${size * 0.18} ${size * 0.5} Z`} fill={stripe} />
    </g>
  );
}

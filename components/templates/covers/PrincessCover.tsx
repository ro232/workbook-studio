import type { Workbook } from "@/types/workbook";
import { PhotoFrame } from "./PhotoFrame";
import { fitTitle } from "./title-fit";

interface Props {
  workbook: Workbook;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Princess theme — soft pink gradient, crown, sparkles, ornate frame.
 * Elegant serif typography with handwritten name.
 */
export function PrincessCover({ workbook, pageWidth, pageHeight }: Props) {
  const { title, child, colorMode } = workbook;
  const isBw = colorMode === "bw";
  const W = pageWidth;
  const H = pageHeight;

  const bg = isBw ? "#ffffff" : "#fdf2f5";
  const bgEnd = isBw ? "#f3f3f3" : "#f7d4e0";
  const accent = isBw ? "#1a1a1a" : "#c97b9f";
  const accentDeep = isBw ? "#333" : "#8a4d6b";
  const ink = isBw ? "#1a1a1a" : "#3a1a2a";
  const gold = isBw ? "#666" : "#d4a574";
  const sparkleColor = isBw ? "#888" : "#e8b8d0";

  const gradId = "princess-bg";

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={bgEnd} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${gradId})`} />

      {/* Decorative scallop top border */}
      <Scallop W={W} y={H * 0.06} fill={accent} />

      {/* Sparkles scattered */}
      <Sparkle cx={W * 0.12} cy={H * 0.12} size={4} fill={sparkleColor} />
      <Sparkle cx={W * 0.88} cy={H * 0.14} size={5} fill={sparkleColor} />
      <Sparkle cx={W * 0.18} cy={H * 0.5} size={3} fill={sparkleColor} />
      <Sparkle cx={W * 0.82} cy={H * 0.55} size={4} fill={sparkleColor} />
      <Sparkle cx={W * 0.14} cy={H * 0.88} size={3.5} fill={sparkleColor} />
      <Sparkle cx={W * 0.86} cy={H * 0.86} size={4} fill={sparkleColor} />

      {/* Crown */}
      <Crown cx={W / 2} cy={H * 0.22} size={W * 0.16} gold={gold} accent={accent} />

      {/* Title eyebrow */}
      <text
        x={W / 2}
        y={H * 0.36}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3.6}
        fontWeight={500}
        fill={accent}
        letterSpacing={3}
      >
        ✦ HER ROYAL HIGHNESS ✦
      </text>

      <text
        x={W / 2}
        y={H * 0.45}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize={fitTitle(title, W, 0.075, 0.04)}
        fontWeight={500}
        fontStyle="italic"
        fill={ink}
      >
        {title}
      </text>

      {/* Ornate divider */}
      <g transform={`translate(${W / 2}, ${H * 0.49})`}>
        <line x1={-W * 0.18} y1={0} x2={-W * 0.04} y2={0} stroke={accent} strokeWidth={0.4} />
        <circle cx={0} cy={0} r={1.2} fill={accent} />
        <line x1={W * 0.04} y1={0} x2={W * 0.18} y2={0} stroke={accent} strokeWidth={0.4} />
      </g>

      {/* Photo or tiara */}
      {child.photo ? (
        <PhotoFrame
          photo={child.photo}
          cx={W / 2}
          cy={H * 0.62}
          size={Math.min(W * 0.34, 64)}
          borderColor={gold}
          borderWidth={1.2}
        />
      ) : (
        <Tiara cx={W / 2} cy={H * 0.62} size={W * 0.18} fill={gold} accent={accent} />
      )}

      {/* Name in handwriting */}
      <text
        x={W / 2}
        y={H * 0.78}
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize={W * 0.13}
        fill={accentDeep}
      >
        {child.name || "—"}
      </text>

      {/* Sub */}
      {child.age && (
        <text
          x={W / 2}
          y={H * 0.85}
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize={4.5}
          fontStyle="italic"
          fill={accent}
        >
          age {child.age} · forever sparkly
        </text>
      )}

      {/* Bottom scallop */}
      <Scallop W={W} y={H * 0.94} fill={accent} flip />

      <text
        x={W / 2}
        y={H * 0.985}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={2.8}
        fill={ink}
        opacity={0.55}
        letterSpacing={1.5}
      >
        WORKBOOK STUDIO · {workbook.format}
      </text>
    </g>
  );
}

function Scallop({ W, y, fill, flip }: { W: number; y: number; fill: string; flip?: boolean }) {
  const r = 4;
  const count = Math.floor(W / (r * 2));
  const direction = flip ? -1 : 1;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={r + i * (r * 2)} cy={y - direction * r * 0.4} r={r} fill={fill} opacity={0.25} />
      ))}
    </g>
  );
}

function Sparkle({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <path
        d={`M 0 -${size} Q ${size * 0.15} -${size * 0.15}, ${size} 0 Q ${size * 0.15} ${size * 0.15}, 0 ${size} Q -${size * 0.15} ${size * 0.15}, -${size} 0 Q -${size * 0.15} -${size * 0.15}, 0 -${size} Z`}
        fill={fill}
      />
    </g>
  );
}

function Crown({ cx, cy, size, gold, accent }: { cx: number; cy: number; size: number; gold: string; accent: string }) {
  const w = size;
  const h = size * 0.7;
  return (
    <g transform={`translate(${cx - w / 2}, ${cy - h / 2})`}>
      {/* Crown body */}
      <path
        d={`M 0 ${h * 0.85}
           L 0 ${h * 0.4}
           L ${w * 0.2} ${h * 0.65}
           L ${w * 0.35} ${h * 0.1}
           L ${w * 0.5} ${h * 0.6}
           L ${w * 0.65} ${h * 0.1}
           L ${w * 0.8} ${h * 0.65}
           L ${w} ${h * 0.4}
           L ${w} ${h * 0.85}
           Z`}
        fill={gold}
        stroke={accent}
        strokeWidth={0.4}
        strokeLinejoin="round"
      />
      <rect x={0} y={h * 0.85} width={w} height={h * 0.12} fill={gold} stroke={accent} strokeWidth={0.4} />
      {/* Gems */}
      <circle cx={w * 0.2} cy={h * 0.65} r={2} fill="#e0567b" />
      <circle cx={w * 0.5} cy={h * 0.6} r={2.5} fill="#7ab8d4" />
      <circle cx={w * 0.8} cy={h * 0.65} r={2} fill="#e0567b" />
      <circle cx={w * 0.5} cy={h * 0.92} r={1.6} fill="#fff" />
    </g>
  );
}

function Tiara({ cx, cy, size, fill, accent }: { cx: number; cy: number; size: number; fill: string; accent: string }) {
  const w = size;
  const h = size * 0.5;
  return (
    <g transform={`translate(${cx - w / 2}, ${cy - h / 2})`}>
      <path
        d={`M 0 ${h}
           Q ${w * 0.3} ${h * 0.3}, ${w * 0.5} ${h * 0.05}
           Q ${w * 0.7} ${h * 0.3}, ${w} ${h}`}
        fill="none"
        stroke={fill}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <circle cx={w * 0.5} cy={h * 0.1} r={2.5} fill={accent} />
      <circle cx={w * 0.25} cy={h * 0.5} r={1.8} fill={accent} />
      <circle cx={w * 0.75} cy={h * 0.5} r={1.8} fill={accent} />
    </g>
  );
}

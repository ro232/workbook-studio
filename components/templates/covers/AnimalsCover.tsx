import type { Workbook } from "@/types/workbook";
import { PhotoFrame } from "./PhotoFrame";
import { fitTitle } from "./title-fit";

interface Props {
  workbook: Workbook;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Animals theme — warm cream paper, hand-drawn forest creatures (bear, fox, bunny, leaves)
 * arranged organically. Friendly, storybook feel.
 */
export function AnimalsCover({ workbook, pageWidth, pageHeight }: Props) {
  const { title, child, colorMode } = workbook;
  const bg = colorMode === "bw" ? "#ffffff" : "#fdf6ec";
  const accent = colorMode === "bw" ? "#1a1a1a" : "#a06b3a";
  const accentSoft = colorMode === "bw" ? "#e0e0e0" : "#e9c79a";
  const ink = colorMode === "bw" ? "#1a1a1a" : "#3a2a1a";
  const leaf = colorMode === "bw" ? "#cccccc" : "#7a8a5c";
  const accentDark = colorMode === "bw" ? "#333" : "#6e3e1a";

  const W = pageWidth;
  const H = pageHeight;

  return (
    <g>
      <rect width={W} height={H} fill={bg} />

      {/* Top organic banner */}
      <path
        d={`M0 ${H * 0.16} Q ${W * 0.25} ${H * 0.22}, ${W * 0.5} ${H * 0.16} T ${W} ${H * 0.16} L ${W} 0 L 0 0 Z`}
        fill={accentSoft}
      />

      {/* Decorative leaves */}
      <Leaf x={W * 0.08} y={H * 0.05} rot={-20} size={14} fill={leaf} />
      <Leaf x={W * 0.92} y={H * 0.06} rot={30} size={16} fill={leaf} />
      <Leaf x={W * 0.06} y={H * 0.93} rot={150} size={14} fill={leaf} />
      <Leaf x={W * 0.94} y={H * 0.94} rot={-150} size={16} fill={leaf} />

      {/* Bear (top-left) */}
      <BearFace x={W * 0.18} y={H * 0.27} size={W * 0.14} fill={accentDark} />
      {/* Fox (top-right) */}
      <FoxFace x={W * 0.82} y={H * 0.27} size={W * 0.14} fill={accent} />

      {/* Title block */}
      <text
        x={W / 2}
        y={H * 0.42}
        textAnchor="middle"
        fontFamily="Quicksand, sans-serif"
        fontSize={3.6}
        fontWeight={500}
        fill={accent}
        letterSpacing={2.4}
      >
        ANIMAL FRIENDS · WORKBOOK
      </text>

      <text
        x={W / 2}
        y={H * 0.5}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize={fitTitle(title, W, 0.078, 0.04)}
        fontWeight={600}
        fill={ink}
      >
        {title}
      </text>

      {/* Photo or bunny */}
      {child.photo ? (
        <PhotoFrame
          photo={child.photo}
          cx={W / 2}
          cy={H * 0.66}
          size={Math.min(W * 0.36, 70)}
          borderColor={accent}
          borderWidth={1}
        />
      ) : (
        <BunnyFace x={W / 2} y={H * 0.66} size={W * 0.18} fill={accentDark} />
      )}

      {/* Child name on a banner */}
      <g>
        <rect
          x={W * 0.22}
          y={H * 0.78}
          width={W * 0.56}
          height={H * 0.08}
          rx={3}
          fill={accent}
          opacity={0.92}
        />
        <text
          x={W / 2}
          y={H * 0.838}
          textAnchor="middle"
          fontFamily="Patrick Hand, cursive"
          fontSize={W * 0.075}
          fill="#fff8ee"
        >
          {child.name || "—"}
        </text>
      </g>

      {child.age && (
        <text
          x={W / 2}
          y={H * 0.9}
          textAnchor="middle"
          fontFamily="Quicksand, sans-serif"
          fontSize={4}
          fontWeight={500}
          fill={accent}
        >
          {child.age} years old
        </text>
      )}

      {/* Bottom paw prints */}
      <PawPrint x={W * 0.18} y={H * 0.94} size={3} fill={accentDark} />
      <PawPrint x={W * 0.5} y={H * 0.96} size={3} fill={accentDark} />
      <PawPrint x={W * 0.82} y={H * 0.94} size={3} fill={accentDark} />
    </g>
  );
}

function BearFace({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  const r = size / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx={-r * 0.7} cy={-r * 0.6} r={r * 0.32} fill={fill} />
      <circle cx={r * 0.7} cy={-r * 0.6} r={r * 0.32} fill={fill} />
      <circle cx={0} cy={0} r={r} fill={fill} />
      <circle cx={0} cy={r * 0.05} r={r * 0.55} fill="#fbe5c7" />
      <circle cx={-r * 0.32} cy={-r * 0.18} r={r * 0.08} fill="#1a1a1a" />
      <circle cx={r * 0.32} cy={-r * 0.18} r={r * 0.08} fill="#1a1a1a" />
      <ellipse cx={0} cy={r * 0.22} rx={r * 0.15} ry={r * 0.12} fill="#1a1a1a" />
    </g>
  );
}

function FoxFace({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  const r = size / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ears */}
      <polygon points={`${-r * 0.7},${-r * 0.4} ${-r * 0.95},${-r * 1.1} ${-r * 0.3},${-r * 0.7}`} fill={fill} />
      <polygon points={`${r * 0.7},${-r * 0.4} ${r * 0.95},${-r * 1.1} ${r * 0.3},${-r * 0.7}`} fill={fill} />
      <polygon points={`${-r * 0.7},${-r * 0.45} ${-r * 0.85},${-r * 0.95} ${-r * 0.4},${-r * 0.65}`} fill="#fff" />
      <polygon points={`${r * 0.7},${-r * 0.45} ${r * 0.85},${-r * 0.95} ${r * 0.4},${-r * 0.65}`} fill="#fff" />
      {/* Face */}
      <ellipse cx={0} cy={0} rx={r * 0.95} ry={r * 0.85} fill={fill} />
      <ellipse cx={0} cy={r * 0.2} rx={r * 0.6} ry={r * 0.5} fill="#fff" />
      <circle cx={-r * 0.32} cy={-r * 0.18} r={r * 0.08} fill="#1a1a1a" />
      <circle cx={r * 0.32} cy={-r * 0.18} r={r * 0.08} fill="#1a1a1a" />
      <ellipse cx={0} cy={r * 0.32} rx={r * 0.13} ry={r * 0.1} fill="#1a1a1a" />
    </g>
  );
}

function BunnyFace({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  const r = size / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ears */}
      <ellipse cx={-r * 0.4} cy={-r * 1.1} rx={r * 0.18} ry={r * 0.7} fill={fill} />
      <ellipse cx={r * 0.4} cy={-r * 1.1} rx={r * 0.18} ry={r * 0.7} fill={fill} />
      <ellipse cx={-r * 0.4} cy={-r * 1.05} rx={r * 0.08} ry={r * 0.55} fill="#fbd7d7" />
      <ellipse cx={r * 0.4} cy={-r * 1.05} rx={r * 0.08} ry={r * 0.55} fill="#fbd7d7" />
      {/* Face */}
      <circle cx={0} cy={0} r={r} fill={fill} />
      <circle cx={-r * 0.32} cy={-r * 0.15} r={r * 0.09} fill="#1a1a1a" />
      <circle cx={r * 0.32} cy={-r * 0.15} r={r * 0.09} fill="#1a1a1a" />
      <ellipse cx={0} cy={r * 0.18} rx={r * 0.13} ry={r * 0.09} fill="#e08aa0" />
      <line x1={0} y1={r * 0.27} x2={0} y2={r * 0.4} stroke="#1a1a1a" strokeWidth={0.5} />
      <line x1={0} y1={r * 0.4} x2={-r * 0.15} y2={r * 0.5} stroke="#1a1a1a" strokeWidth={0.5} />
      <line x1={0} y1={r * 0.4} x2={r * 0.15} y2={r * 0.5} stroke="#1a1a1a" strokeWidth={0.5} />
    </g>
  );
}

function Leaf({ x, y, size, rot, fill }: { x: number; y: number; size: number; rot: number; fill: string }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <path
        d={`M 0 0 Q ${size * 0.3} ${-size * 0.6}, 0 ${-size} Q ${-size * 0.3} ${-size * 0.6}, 0 0 Z`}
        fill={fill}
        opacity={0.85}
      />
      <line x1={0} y1={0} x2={0} y2={-size} stroke="#3a4a2c" strokeWidth={0.3} />
    </g>
  );
}

function PawPrint({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity={0.4}>
      <ellipse cx={0} cy={0} rx={size * 0.7} ry={size * 0.55} fill={fill} />
      <circle cx={-size * 0.7} cy={-size * 0.6} r={size * 0.25} fill={fill} />
      <circle cx={-size * 0.25} cy={-size * 0.85} r={size * 0.25} fill={fill} />
      <circle cx={size * 0.25} cy={-size * 0.85} r={size * 0.25} fill={fill} />
      <circle cx={size * 0.7} cy={-size * 0.6} r={size * 0.25} fill={fill} />
    </g>
  );
}

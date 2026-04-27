import type { ChildPhoto } from "@/types/workbook";

interface Props {
  photo: ChildPhoto;
  cx: number;
  cy: number;
  size: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Renders a child photo inside a clipped frame using the configured shape and crop.
 * Used by all cover themes when child.photo is set.
 */
export function PhotoFrame({ photo, cx, cy, size, borderColor = "#ffffff", borderWidth = 1.5 }: Props) {
  const clipId = `photo-clip-${cx}-${cy}-${size}`;
  const half = size / 2;

  // Build the clip path for the chosen shape
  let clipShape: React.ReactElement;
  if (photo.crop.shape === "circle") {
    clipShape = <circle cx={cx} cy={cy} r={half} />;
  } else if (photo.crop.shape === "rounded") {
    clipShape = <rect x={cx - half} y={cy - half} width={size} height={size} rx={size * 0.18} />;
  } else {
    clipShape = <rect x={cx - half} y={cy - half} width={size} height={size} />;
  }

  // Apply crop window — cropped region is photo.crop.{x,y,width,height} as % of source
  // We position the image so that the crop window fits inside the clip rectangle.
  const zoom = photo.crop.zoom || 1;
  const imgW = (size * 100) / Math.max(1, photo.crop.width) * zoom;
  const imgH = (size * 100) / Math.max(1, photo.crop.height) * zoom;
  const imgX = cx - half - (photo.crop.x / 100) * imgW;
  const imgY = cy - half - (photo.crop.y / 100) * imgH;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>{clipShape}</clipPath>
      </defs>

      {/* Background fallback */}
      <g clipPath={`url(#${clipId})`}>
        <rect x={cx - half} y={cy - half} width={size} height={size} fill="#f0f0f0" />
        {photo.dataUrl && (
          <image href={photo.dataUrl} x={imgX} y={imgY} width={imgW} height={imgH} preserveAspectRatio="xMidYMid slice" />
        )}
      </g>

      {/* Border */}
      {photo.crop.shape === "circle" && (
        <circle cx={cx} cy={cy} r={half} fill="none" stroke={borderColor} strokeWidth={borderWidth} />
      )}
      {photo.crop.shape === "rounded" && (
        <rect x={cx - half} y={cy - half} width={size} height={size} rx={size * 0.18} fill="none" stroke={borderColor} strokeWidth={borderWidth} />
      )}
      {photo.crop.shape === "square" && (
        <rect x={cx - half} y={cy - half} width={size} height={size} fill="none" stroke={borderColor} strokeWidth={borderWidth} />
      )}
    </g>
  );
}

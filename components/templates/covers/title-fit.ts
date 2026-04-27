/**
 * Pick a font size for a cover title that fits within page width.
 * `max` and `min` are fractions of pageWidth (e.g. 0.085, 0.045).
 */
export function fitTitle(title: string, pageWidth: number, max: number, min: number): number {
  const len = (title || "").length;
  if (len <= 16) return pageWidth * max;
  if (len <= 22) return pageWidth * (max * 0.82);
  if (len <= 30) return pageWidth * (max * 0.7);
  if (len <= 40) return pageWidth * (max * 0.6);
  return pageWidth * min;
}

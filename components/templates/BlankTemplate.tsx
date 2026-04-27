import type { Workbook, PageConfig } from "@/types/workbook";

interface Props {
  workbook: Workbook;
  page: PageConfig;
  pageWidth: number;
  pageHeight: number;
}

export function BlankTemplate({ workbook, page, pageWidth }: Props) {
  const { margins } = workbook;

  let title = "";
  let subtitle = "";
  if (page.type === "blank") {
    title = "Blank page";
    subtitle = "Use this space however you like.";
  } else if (page.type === "free-write") {
    title = "Free writing";
    subtitle = "Write a sentence about your day.";
  } else if (page.type === "coloring") {
    title = "Coloring page";
    subtitle = "Color the shapes any way you like.";
  }

  return (
    <g>
      <text
        x={margins.left}
        y={margins.top + 6}
        fontFamily="Quicksand, sans-serif"
        fontSize={3.2}
        fill="#2f6b5e"
        letterSpacing={1.8}
      >
        {title.toUpperCase()}
      </text>
      <line x1={margins.left} y1={margins.top + 9} x2={margins.left + 30} y2={margins.top + 9} stroke="#2f6b5e" strokeWidth={0.5} />
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
    </g>
  );
}

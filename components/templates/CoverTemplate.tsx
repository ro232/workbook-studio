import type { Workbook } from "@/types/workbook";
import { MinimalistCover } from "./covers/MinimalistCover";
import { AnimalsCover } from "./covers/AnimalsCover";
import { SpaceCover } from "./covers/SpaceCover";
import { PrincessCover } from "./covers/PrincessCover";

interface Props {
  workbook: Workbook;
  pageWidth: number;
  pageHeight: number;
}

export function CoverTemplate(props: Props) {
  const { theme } = props.workbook;
  switch (theme) {
    case "animals":
      return <AnimalsCover {...props} />;
    case "space":
      return <SpaceCover {...props} />;
    case "princess":
      return <PrincessCover {...props} />;
    case "minimalist":
    default:
      return <MinimalistCover {...props} />;
  }
}

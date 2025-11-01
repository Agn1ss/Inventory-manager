import type InventoriesDataResponse from "../models/response/InvDataResponse";
import MarkdownTooltipTrigger from "./MarkdownTooltipTrigger";
import markdownToText from "../utils/functions/markdownToText";

export default function InventoryRow({ row }: { row: InventoriesDataResponse }) {
  const description = row.description || "-";
  const textDescription = markdownToText(description);

  const shortDescription = getTextshorted(textDescription,30);
  const shortTitle = getTextshorted(row.title, 20);
  const shortName = getTextshorted(row.creatorName, 20);

  return (
    <>
      <td>{shortTitle}</td>
      <td>
        <MarkdownTooltipTrigger content={description}>{shortDescription}</MarkdownTooltipTrigger>
      </td>
      <td>{shortName}</td>
    </>
  );
}

function getTextshorted(text: string, len: number): string{
  return text.length > len ? text.slice(0, len) + "..." : text;
}

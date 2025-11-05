import { useNavigate } from "react-router-dom";
import type InventorylistDataResponse from "../../../models/response/InventorylistDataResponse";
import markdownToText from "../../../utils/functions/markdownToText";
import MarkdownTooltipTrigger from "../../MarkdownTooltipTrigger";
import getTextshorted from "../../../utils/functions/getTextShorted";

type InventoryRowProps = {
  row: InventorylistDataResponse;
};

export default function InventoryRow({ row }: InventoryRowProps) {
  const navigate = useNavigate();

  const description = row.description ?? "-";
  const textDescription = markdownToText(description) ?? "";

  const shortDescription = getTextshorted(textDescription, 30);
  const shortTitle = getTextshorted(row.title ?? "-", 20);
  const shortCreator = getTextshorted(row.creatorName ?? "-", 20);

  const handleClick = () => {
    navigate(`/inventory/${row.id}`);
  };

  return (
    <tr key={row.id} onClick={handleClick} style={{ cursor: "pointer" }}>
      <td>{shortTitle}</td>
      <td>
        <MarkdownTooltipTrigger content={description}>{shortDescription}</MarkdownTooltipTrigger>
      </td>
      <td>{shortCreator}</td>
    </tr>
  );
}


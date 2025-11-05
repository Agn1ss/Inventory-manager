import MarkdownTooltipTrigger from "../../MarkdownTooltipTrigger";
import markdownToText from "../../../utils/functions/markdownToText";
import type UserInventoryDataResponse from "../../../models/response/UserInventoryDataResponse";
import { useNavigate } from "react-router-dom";
import getTextshorted from "../../../utils/functions/getTextShorted";

type EditableInventoryRowProps = {
  row: UserInventoryDataResponse;
  checked: boolean;
  onSelectChange: (id: string, checked: boolean) => void;
};

export default function EditableInventoryRow({
  row,
  onSelectChange,
  checked = false,
}: EditableInventoryRowProps) {
  const navigate = useNavigate();

  const description = row.description ?? "-";
  const textDescription = markdownToText(description) ?? "";

  const shortDescription = getTextshorted(textDescription, 30);
  const shortTitle = getTextshorted(row.title ?? "-", 20);
  const shortCategory = getTextshorted(row.categoryName ?? "-", 20);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange?.(row.id, e.target.checked);
  };

  const handleClick = () => {
    navigate(`/inventory/${row.id}`);
  };

  return (
    <>
      <tr
        key={row.id}
        onClick={handleClick}
        className={`align-middle ${checked ? "table-active" : ""}`}
        style={{ cursor: "pointer" }}
      >
        <td onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            style={{ cursor: "pointer" }}
          />
        </td>
        <td>{shortTitle}</td>
        <td className="text-center">
          <MarkdownTooltipTrigger content={description}>{shortDescription}</MarkdownTooltipTrigger>
        </td>
        <td>{shortCategory}</td>
      </tr>
    </>
  );
}



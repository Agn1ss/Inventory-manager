import { useNavigate } from "react-router-dom";
import type { IItem } from "../../../models/interface/IItem";
import getFieldValue from "../../../utils/functions/getCustomFieldValue";

type ItemRowProps = {
  row: IItem;
  visibleKeys: string[];
  withCheckbox?: boolean;
  onSelectChange?: (id: string, checked: boolean) => void;
  checked?: boolean;
  withCustomId?: boolean;
};

export default function ItemRow({
  row,
  visibleKeys,
  withCheckbox = true,
  withCustomId = false,
  onSelectChange,
  checked,
}: ItemRowProps) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/item/${row.id}`);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSelectChange?.(row.id, e.target.checked);

  return (
    <tr onClick={handleClick} className={`align-middle ${checked ? "table-active" : ""}`} style={{ cursor: "pointer" }}>
      {withCheckbox && (
        <td onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={checked} onChange={handleChange} />
        </td>
      )}
      {withCustomId && <td>{row.customId}</td>}
      {visibleKeys.map(key => {
        const value = getFieldValue(row.customFields, key);
        return value !== null ? <td key={key}>{value}</td> : null;
      })}
      <td>{row.creatorName}</td>
    </tr>
  );
}

import { useTranslation } from "react-i18next";
import type UserInventoryDataResponse from "../../../models/response/UserInventoryDataResponse";
import EditableInventoryRow from "./EditableInventoryRow";

interface EditableInventoryTableProps {
  inventoriesData?: UserInventoryDataResponse[];
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function EditableInventoryTableBox({
  inventoriesData: data,
  selectedRows,
  setSelectedRows,
}: EditableInventoryTableProps) {
  const { t } = useTranslation();
  const safeData = data || [];
  const allSelected = safeData.length > 0 && safeData.every(row => selectedRows[row.id]);

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: checked,
    }));
  };


  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newSelected: Record<string, boolean> = {};

    if (checked) {
      safeData.forEach(row => {
        newSelected[row.id] = true;
      });
    }
    setSelectedRows(newSelected);
  };

  return (
    <table className="table table-hover text-start align-middle">
      <colgroup>
        <col style={{ width: "5%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "60%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>

      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllChange}
              style={{ cursor: "pointer" }}
            />
          </th>
          <th>{t("title")}</th>
          <th className="text-center">{t("description")}</th>
          <th>{t("category")}</th>
        </tr>
      </thead>

      <tbody>
        {safeData.map(row => (
            <EditableInventoryRow
              row={row}
              onSelectChange={handleSelectChange}
              checked={!!selectedRows[row.id]}
            />
        ))}
      </tbody>
    </table>
  );
}

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { ICustomField } from "../../../models/interface/IInventory";
import { getVisibleFields } from "../../../utils/functions/getVisibleFields";
import MarkdownTooltipTrigger from "../../MarkdownTooltipTrigger";
import type { IItem } from "../../../models/interface/IItem";
import type { InventoryResponse } from "../../../models/response/InventoryResponse";
import ItemRow from "./ItemRow";

interface InventoryItemsTableBoxProps {
  inventoryData: InventoryResponse;
  itemsData: IItem[];
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function InventoryItemsTableBox({
  inventoryData,
  selectedRows,
  setSelectedRows,
  itemsData,
}: InventoryItemsTableBoxProps) {
  const { t } = useTranslation();
  const [visibleFields, setVisibleFields] = useState<ICustomField<any>[]>([]);
  const [visibleFieldsKeys, setVisibleFieldsKeys] = useState<string[]>([]);

  useEffect(() => {
    const visibleCustomFields = getVisibleFields(inventoryData?.inventory.customFields);
    const visibleCustomFieldsKeys = visibleCustomFields.map(f => f.key);
    setVisibleFields(visibleCustomFields);
    setVisibleFieldsKeys(visibleCustomFieldsKeys);
  }, [inventoryData, itemsData]);

  const safeData = itemsData || [];

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: checked,
    }));
  };


  const allSelected = safeData.length > 0 && safeData.every(row => selectedRows[row.id]);

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
          {inventoryData.customIdType.isTypeNotEmpty && <th className="text-start">{t("custom-id")}</th>}
          {visibleFields.map(f => (
            <th key={f.key}>
              <MarkdownTooltipTrigger content={f.description}>{f.name}</MarkdownTooltipTrigger>
            </th>
          ))}
          <th className="text-end">{t("creator")}</th>
        </tr>
      </thead>

      <tbody>
        {itemsData.map(row => (
          <ItemRow
            row={row}
            withCheckbox={true}
            withCustomId={inventoryData.customIdType.isTypeNotEmpty}
            onSelectChange={handleSelectChange}
            checked={!!selectedRows[row.id]}
            visibleKeys={visibleFieldsKeys}
          />
        ))}
      </tbody>
    </table>
  );
}

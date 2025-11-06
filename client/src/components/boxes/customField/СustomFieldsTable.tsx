import React from "react";
import type { ICustomFields, ICustomField } from "../../../models/interface/IInventory";
import CustomFieldRow from "./CustomFieldRow";
import { useTranslation } from "react-i18next";

interface CustomFieldsTableProps {
  customFields: ICustomFields;
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function CustomFieldsTable({
  customFields,
  selectedRows,
  setSelectedRows,
}: CustomFieldsTableProps) {
  const { t } = useTranslation();

  const allFields: ICustomField<any>[] = [
    ...customFields.string,
    ...customFields.text,
    ...customFields.int,
    ...customFields.link,
    ...customFields.bool,
  ];

  const visibleFields = allFields.filter(f => f.state !== "NONE");

  const sortedFields = visibleFields.sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const allSelected = sortedFields.length > 0 && sortedFields.every(f => selectedRows[f.key]);

  const handleSelectChange = (key: string, checked: boolean) => {
    setSelectedRows(prev => ({ ...prev, [key]: checked }));
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newSelected: Record<string, boolean> = {};

    if (checked) {
      sortedFields.forEach(f => {
        newSelected[f.key] = true;
      });
    }

    setSelectedRows(newSelected);
  };

  return (
    <table className="table table-hover text-start align-middle">
      <colgroup>
        <col style={{ width: "5%" }} />
        <col style={{ width: "25%" }} />
        <col style={{ width: "45%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
      </colgroup>

      <thead>
        <tr>
          <th title={t("custom_fields_table.select_all")}>
            <input type="checkbox" checked={allSelected} onChange={handleSelectAllChange} />
          </th>
          <th>{t("custom_fields_table.name")}</th>
          <th>{t("custom_fields_table.description")}</th>
          <th>{t("custom_fields_table.type")}</th>
          <th>{t("custom_fields_table.visible")}</th>
        </tr>
      </thead>

      <tbody>
        {sortedFields.map(field => (
          <CustomFieldRow
            key={field.key}
            field={field}
            checked={!!selectedRows[field.key]}
            onSelectChange={handleSelectChange}
          />
        ))}
      </tbody>
    </table>
  );
}

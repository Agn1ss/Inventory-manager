import React from "react";
import extractFieldType from "../../../utils/functions/extractFieldType";
import { CustomFieldDisplayMap, FieldStateDisplayMap } from "../../../utils/data/names";

export type FieldState = "NONE" | "NOT_VISIBLE" | "VISIBLE";

export interface ICustomField<T> {
  key: string;
  name?: string | null;
  description?: string | null;
  order?: number | null;
  state: FieldState;
}

type CustomFieldRowProps<T> = {
  field: ICustomField<T>;
  checked: boolean;
  onSelectChange: (key: string, checked: boolean) => void;
};

export default function CustomFieldRow<T>({
  field,
  checked,
  onSelectChange,
}: CustomFieldRowProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange(field.key, e.target.checked);
  };

  const typeKey = extractFieldType(field.key) as keyof typeof CustomFieldDisplayMap;
  const typeInfo = CustomFieldDisplayMap[typeKey] || { label: typeKey, textClass: "", isNumeric: false };
  const stateInfo = FieldStateDisplayMap[field.state] || { label: "-", textClass: "" };

  return (
    <tr className={`align-middle ${checked ? "table-active" : ""}`} style={{ cursor: "pointer" }}>
      <td onClick={e => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={handleChange} />
      </td>
      <td>{field.name || "-"}</td>
      <td>{field.description || "-"}</td>
      <td className={typeInfo.textClass}>{typeInfo.label}</td>
      <td className={stateInfo.textClass}>{stateInfo.label}</td>
    </tr>
  );
}
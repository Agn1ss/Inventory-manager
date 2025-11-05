import type { ICustomFields, ICustomField } from "../../models/interface/IInventory";

export function getVisibleFields(customFields?: ICustomFields): ICustomField<any>[] {
  if (!customFields) return [];

  const allFields: ICustomField<any>[] = [
    ...customFields.string,
    ...customFields.text,
    ...customFields.int,
    ...customFields.link,
    ...customFields.bool,
  ];

  const visibleFields = allFields.filter(field => field.state === "VISIBLE");

  visibleFields.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  return visibleFields;
}
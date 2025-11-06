import type { ICustomField, ICustomFields } from "../../models/interface/IInventory";

export default function findNextOrder(customFields: ICustomFields): number {
  const allFields = Object.values(customFields).flat();
  const usedOrders = allFields
    .filter(f => f.state !== "NONE" && f.order != null)
    .map(f => f.order as number);
  if (usedOrders.length === 0) return 1;

  return Math.max(...usedOrders) + 1;
}
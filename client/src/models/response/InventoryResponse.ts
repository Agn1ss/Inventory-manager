import type { ICustomIdType } from "../interface/ICustomIdType";
import type { IInventory } from "../interface/IInventory";

export interface InventoryResponse {
  inventory: IInventory;
  tags: string[] | null;
  category: string;
  customIdType: ICustomIdType;
}
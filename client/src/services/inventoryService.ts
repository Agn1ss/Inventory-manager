import $api from "../http";
import type { IInventory } from "../models/interface/IInventory";
import type InventoriesDataResponse from "../models/response/InvDataResponse";

// export interface ICreateInventoryDto {
//   // пример полей для создания инвентаря
//   name: string;
//   description?: string;
//   items?: any[];
// }

// export interface IUpdateInventoryDto {
//   // пример полей для обновления инвентаря
//   name?: string;
//   description?: string;
//   items?: any[];
// }

export default class InventoryService {
  // static createInventory(data: ICreateInventoryDto) {
  //   return $api.post<IInventory>("/inventory/create", data);
  // }

  // static updateInventory(id: string, data: IUpdateInventoryDto) {
  //   return $api.put<IInventory>(`/inventory/${id}/update`, data);
  // }

  // static getInventory(id: string) {
  //   return $api.get<IInventory>(`/inventory/${id}`);
  // }

  static searchInventories(
    search: string,
    skip: number,
    take: number,
    newest: boolean
  ) {
    return $api.get<InventoriesDataResponse[]>("/inventory/inventories", {
      params: { search, skip, take, newest },
    });
  }

  static getMostPopularInventories(limit: number) {
    return $api.get<InventoriesDataResponse[]>(`/inventory/inventories/popular`, {
      params: { limit },
    });
  }

  static getInventoriesByTag(tagId: string, skip = 0, take = 20) {
    return $api.get<InventoriesDataResponse[]>(`/inventory/tags/${tagId}/inventories`, {
      params: { tagId, skip, take },
    });
  }
}
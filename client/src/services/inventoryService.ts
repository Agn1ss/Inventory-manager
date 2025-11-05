import $api from "../http";
import type InventorylistDataResponse from "../models/response/InventorylistDataResponse";
import type { InventoryResponse } from "../models/response/InventoryResponse";
import type UserInventoryDataResponse from "../models/response/UserInventoryDataResponse";

export default class InventoryService {
  static async createInventory() {
    return $api.post<InventoryResponse>("/inventory/create");
  }

  static async updateInventory(id: string, data: InventoryResponse) {
    return $api.post<InventoryResponse>(`/inventory/${id}/update`, data);
  }

  static searchInventories(search: string, skip: number, take: number, newest: boolean) {
    return $api.get<InventorylistDataResponse[]>("/inventory/inventories", {
      params: { search, skip, take, newest },
    });
  }

  static getMostPopularInventories(limit: number) {
    return $api.get<InventorylistDataResponse[]>(`/inventory/inventories/popular`, {
      params: { limit },
    });
  }

  static getInventoriesByTag(tagId: string, skip = 0, take = 20) {
    return $api.get<InventorylistDataResponse[]>(`/inventory/tags/${tagId}/inventories`, {
      params: { tagId, skip, take },
    });
  }

  static getUserInventories(search = "", skip = 0, take = 20) {
    return $api.get<UserInventoryDataResponse[]>("/inventories", {
      params: { search, skip, take },
    });
  }

  static deleteMany(ids: string[]) {
    return $api.post("/inventory/delete-many", { ids });
  }

  static getUserEditableInventories(search = "", skip = 0, take = 20) {
    return $api.get<InventorylistDataResponse[]>("/inventories/editable", {
      params: { search, skip, take },
    });
  }

  static getInventory(id: string) {
    return $api.get<InventoryResponse>(`/inventory/${id}`);
  }
}

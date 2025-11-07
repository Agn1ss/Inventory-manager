import $api from "../http";
import type { IItem } from "../models/interface/IItem";

export default class ItemService {

  static getItems(inventoryId: string, search = "", skip = 0, take = 20) {
    return $api.get<IItem[]>(`/inventory/${inventoryId}/items`, {
      params: { search, skip, take },
    });
  }

  static deleteMany(inventoryId: string, itemIds: string[]) {
    return $api.post(`/inventory/${inventoryId}/items/delete-many`, { itemIds });
  }

  static async createItem(inventoryId: string) {
    return $api.post<IItem>(`/inventory/${inventoryId}/items/create`);
  }

}
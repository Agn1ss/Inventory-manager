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

  
  // static create(inventoryId: string) {
  //   return $api.post(`/inventory/${inventoryId}/items/create`);
  // }

  // static getOne(inventoryId: string, itemId: string) {
  //   return $api.get(`/inventory/${inventoryId}/items/${itemId}`);
  // }

  // static update(inventoryId: string, itemId: string, itemData: any) {
  //   return $api.put(`/inventory/${inventoryId}/items/${itemId}`, itemData);
  // }

  // static delete(inventoryId: string, itemId: string) {
  //   return $api.delete(`/inventory/${inventoryId}/items/${itemId}`);
  // }

  // static like(itemId: string) {
  //   return $api.post(`/items/${itemId}/like`);
  // }
}
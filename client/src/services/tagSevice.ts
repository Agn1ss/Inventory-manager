import $api from "../http";
import type { ITag } from "../models/interface/ITag";
import type InventoriesDataResponse from "../models/response/InvDataResponse";

export default class TagService {
  static getTags(searchQuery: string, limit = 8,isSearch = false) {
    return $api.get<ITag[]>("inventory/tags", {
      params: { searchQuery, limit,isSearch },
    });
  }

  static getOne(tagId: string) {
    return $api.get<ITag>(`inventory/tags/${tagId}`);
  }

  static setInventoryTags(inventoryId: string, tags: string[]) {
    return $api.post("/tags/set-inventory-tags", {
      inventoryId,
      tags,
    });
  }
}
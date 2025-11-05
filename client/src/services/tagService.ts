import $api from "../http";
import type { ICategory } from "../models/interface/ICategory";
import type { ITag } from "../models/interface/ITag";

export default class TagService {
  static getTags(search: string, limit = 8,isSearch = false) {
    return $api.get<ITag[]>("inventory/tags", {
      params: { search, limit,isSearch },
    });
  }

  static getOne(tagId: string) {
    return $api.get<ITag>(`inventory/tags/${tagId}`);
  }

  static getCategories(search: string, limit = 8) {
    return $api.get<ICategory[]>("inventory/categories", {
      params: { search, limit },
    });
  }

  static getInventoryTags(inventoryId: string) {
    return $api.get<ITag[]>(`inventory/${inventoryId}/tags`);
  }
}
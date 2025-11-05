import { create } from "zustand";
import InventoryService from "../services/inventoryService";
import TagService from "../services/tagService";
import type InventorylistDataResponse from "../models/response/InventorylistDataResponse";
import type UserInventoryItemResponse from "../models/response/UserInventoryDataResponse";
import type { ITag } from "../models/interface/ITag";
import type { ICategory } from "../models/interface/ICategory";

interface InventoryListState {
  data: InventorylistDataResponse[];
  loading: boolean;
}

interface UserInventoryState {
  data: UserInventoryItemResponse[];
  loading: boolean;
}

interface TagListState {
  data: ITag[];
  loading: boolean;
}

interface CategoryListState {
  data: ICategory[];
  loading: boolean;
}

interface InventoryState {
  searchResults: InventoryListState;
  latestInventories: InventoryListState;
  popularInventories: InventoryListState;
  tagList: TagListState;
  categoryList: CategoryListState;
  inventoriesByTag: InventoryListState;
  userInventories: UserInventoryState;
  userEditableInventories: InventoryListState;
  selectedTagName: string | null;

  setLoading: (
    key: keyof Omit<
      InventoryState,
      | "setLoading"
      | "clearSelectedTagName"
      | "fetchSearchInventories"
      | "fetchLatestInventories"
      | "fetchPopularInventories"
      | "fetchCategories"  
      | "fetchTags"
      | "fetchInventoriesByTag"
      | "fetchUserInventories"
      | "fetchUserEditableInventories"
    >,
    loading: boolean
  ) => void;

  fetchUserEditableInventories: (search?: string, skip?: number, take?: number) => Promise<void>;
  fetchSearchInventories: (search: string, skip?: number, take?: number) => Promise<void>;
  fetchLatestInventories: (limit?: number) => Promise<void>;
  fetchPopularInventories: (limit?: number) => Promise<void>;
  fetchCategories: (search: string, limit?: number) => Promise<void>;
  fetchTags: (search: string, limit?: number, isSearch?: boolean) => Promise<void>;
  fetchInventoriesByTag: (tagId: string, skip?: number, take?: number) => Promise<void>;
  fetchUserInventories: (search?: string, skip?: number, take?: number) => Promise<void>;
  clearSelectedTagName: () => void;
  deleteUserInventories: (ids: string[]) => Promise<void>;
}

const useInventoryListStore = create<InventoryState>(set => ({
  searchResults: { data: [], loading: false },
  latestInventories: { data: [], loading: false },
  popularInventories: { data: [], loading: false },
  tagList: { data: [], loading: false },
  categoryList: { data: [], loading: false },
  inventoriesByTag: { data: [], loading: false },
  userInventories: { data: [], loading: false },
  userEditableInventories: { data: [], loading: false },
  selectedTagName: null,

  setLoading: (key, loading) => {
    const state = useInventoryListStore.getState();
    const target = state[key] as InventoryListState | TagListState | UserInventoryState | CategoryListState;
    set({ [key]: { ...target, loading } } as any);
  },

  clearSelectedTagName: () => {
    set({ selectedTagName: null });
  },

  fetchSearchInventories: async (search, skip = 0, take = 5) => {
    useInventoryListStore.getState().setLoading("searchResults", true);
    try {
      const response = await InventoryService.searchInventories(search, skip, take, false);
      set({ searchResults: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("searchResults", false);
    }
  },

  fetchLatestInventories: async (limit = 5) => {
    useInventoryListStore.getState().setLoading("latestInventories", true);
    try {
      const response = await InventoryService.searchInventories("", 0, limit, true);
      set({ latestInventories: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("latestInventories", false);
    }
  },

  fetchPopularInventories: async (limit = 5) => {
    useInventoryListStore.getState().setLoading("popularInventories", true);
    try {
      const response = await InventoryService.getMostPopularInventories(limit);
      set({ popularInventories: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("popularInventories", false);
    }
  },

  fetchUserInventories: async (search = "", skip = 0, take = 20) => {
    useInventoryListStore.getState().setLoading("userInventories", true);
    try {
      const response = await InventoryService.getUserInventories(search, skip, take);
      set({ userInventories: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("userInventories", false);
    }
  },

  fetchUserEditableInventories: async (search = "", skip = 0, take = 20) => {
    useInventoryListStore.getState().setLoading("userEditableInventories", true);
    try {
      const response = await InventoryService.getUserEditableInventories(search, skip, take);
      console.log(response);
      set({ userEditableInventories: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("userEditableInventories", false);
    }
  },

  deleteUserInventories: async (ids: string[]) => {
    useInventoryListStore.getState().setLoading("userInventories", true);
    try {
      await InventoryService.deleteMany(ids);
      const state = useInventoryListStore.getState();
      const filteredData = state.userInventories.data.filter(inv => !ids.includes(inv.id));
      set({ userInventories: { data: filteredData, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("userInventories", false);
    }
  },

  fetchTags: async (search: string, limit = 8, isSearch = false) => {
    useInventoryListStore.getState().setLoading("tagList", true);
    try {
      const response = await TagService.getTags(search, limit, isSearch);
      set({ tagList: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("tagList", false);
    }
  },

  fetchInventoriesByTag: async (tagId: string, skip = 0, take = 20) => {
    useInventoryListStore.getState().setLoading("inventoriesByTag", true);
    try {
      const tagResponse = await TagService.getOne(tagId);
      const tagName = tagResponse.data.name;
      const invResponse = await InventoryService.getInventoriesByTag(tagId, skip, take);
      set({
        inventoriesByTag: { data: invResponse.data, loading: false },
        selectedTagName: tagName,
      });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("inventoriesByTag", false);
    }
  },

  fetchCategories: async (search = "", limit = 8) => {
    useInventoryListStore.getState().setLoading("categoryList", true);
    try {
      const response = await TagService.getCategories(search, limit);
      set({ categoryList: { data: response.data, loading: false } });
    } catch (err: any) {
      throw err;
    } finally {
      useInventoryListStore.getState().setLoading("categoryList", false);
    }
  },
}));

export default useInventoryListStore;

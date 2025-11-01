import { create } from "zustand";
import InventoryService from "../services/inventoryService";
import TagService from "../services/tagSevice";
import type InventoriesDataResponse from "../models/response/InvDataResponse";
import type { ITag } from "../models/interface/ITag";

type InventoryMethods =
  | "setLoading"
  | "fetchSearchInventories"
  | "fetchLatestInventories"
  | "fetchPopularInventories"
  | "fetchTags"
  | "fetchInventoriesByTag";

interface InventoryListState {
  data: InventoriesDataResponse[];
  loading: boolean;
}

interface TagListState {
  data: ITag[];
  loading: boolean;
}

interface InventoryState {
  searchResults: InventoryListState;
  latestInventories: InventoryListState;
  popularInventories: InventoryListState;
  tagList: TagListState;
  inventoriesByTag: InventoryListState;
  selectedTagName: string | null;

  setLoading: (
    key: keyof Omit<InventoryState, InventoryMethods>,
    loading: boolean
  ) => void;

  fetchSearchInventories: (search: string, skip?: number, take?: number) => Promise<void>;
  fetchLatestInventories: (limit?: number) => Promise<void>;
  fetchPopularInventories: (limit?: number) => Promise<void>;
  fetchTags: (searchQuery: string, limit?: number) => Promise<void>;
  fetchInventoriesByTag: (tagId: string, skip?: number, take?: number) => Promise<void>;
  clearSelectedTagName:() => void;
}

const useInventoryStore = create<InventoryState>((set) => ({
  searchResults: { data: [], loading: false },
  latestInventories: { data: [], loading: false },
  popularInventories: { data: [], loading: false },
  tagList: { data: [], loading: false },
  inventoriesByTag: { data: [], loading: false },
  selectedTagName: null,

  setLoading: (key, loading) => {
    const state = useInventoryStore.getState();
    const target = state[key] as InventoryListState | TagListState;
    set({ [key]: { ...target, loading } } as any);
  },

  clearSelectedTagName: () => {
    set({ selectedTagName: null });
  },

  fetchSearchInventories: async (search, skip = 0, take = 5) => {
    useInventoryStore.getState().setLoading("searchResults", true);
    try {
      const response = await InventoryService.searchInventories(search, skip, take, false);
      set({ searchResults: { data: response.data, loading: false } });
    } catch (e: any) {
      throw e;
    } finally {
      useInventoryStore.getState().setLoading("searchResults", false);
    }
  },

  fetchLatestInventories: async (limit = 5) => {
    useInventoryStore.getState().setLoading("latestInventories", true);
    try {
      const response = await InventoryService.searchInventories("", 0, limit, true);
      set({ latestInventories: { data: response.data, loading: false } });
    } catch (e: any) {
      throw e;
    } finally {
      useInventoryStore.getState().setLoading("latestInventories", false);
    }
  },

  fetchPopularInventories: async (limit = 5) => {
    useInventoryStore.getState().setLoading("popularInventories", true);
    try {
      const response = await InventoryService.getMostPopularInventories(limit);
      set({ popularInventories: { data: response.data, loading: false } });
    } catch (e: any) {
      throw e;
    } finally {
      useInventoryStore.getState().setLoading("popularInventories", false);
    }
  },

  fetchTags: async (searchQuery: string, limit = 8) => {
    useInventoryStore.getState().setLoading("tagList", true);
    try {
      const response = await TagService.getTags(searchQuery, limit);
      set({ tagList: { data: response.data, loading: false } });
    } catch (e: any) {
      throw e;
    } finally {
      useInventoryStore.getState().setLoading("tagList", false);
    }
  },

  fetchInventoriesByTag: async (tagId: string, skip = 0, take = 20) => {
    useInventoryStore.getState().setLoading("inventoriesByTag", true);
    try {
      const tagResponse = await TagService.getOne(tagId);
      const tagName = tagResponse.data.name;
      console.log(tagName)

      const invResponse = await InventoryService.getInventoriesByTag(tagId, skip, take);
      console.log(invResponse)

      set({
        inventoriesByTag: { data: invResponse.data, loading: false },
        selectedTagName: tagName,
      });
    } catch (e: any) {
      throw e;
    } finally {
      useInventoryStore.getState().setLoading("inventoriesByTag", false);
    }
  },
}));

export default useInventoryStore;
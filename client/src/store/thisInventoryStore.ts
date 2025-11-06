import { create } from "zustand";
import InventoryService from "../services/inventoryService";
import ItemService from "../services/itemService";
import type { ICustomField, ICustomFields } from "../models/interface/IInventory";
import type { IItem } from "../models/interface/IItem";
import type { InventoryResponse } from "../models/response/InventoryResponse";
import type { ITag } from "../models/interface/ITag";
import tagService from "../services/tagService";
import findNextOrder from "../utils/functions/findNextOrder";
import type { ICustomIdType } from "../models/interface/ICustomIdType";

export type FieldState = "NONE" | "NOT_VISIBLE" | "VISIBLE";

interface CustomFieldInput {
  name: string;
  description: string;
  type: keyof ICustomFields;
  visible: boolean;
}

interface ThisInventoryState {
  invData: InventoryResponse | null;
  invUpdateData: InventoryResponse | null;
  items: IItem[];
  inventoryTags: ITag[];
  loading: boolean;
  itemsLoading: boolean;
  tagsLoading: boolean;

  fetchInventory: (id: string) => Promise<void>;
  createInventory: () => Promise<void>;
  updateInventory: () => Promise<void>;
  fetchThisInventoryItems: (
    id: string,
    search?: string,
    skip?: number,
    take?: number
  ) => Promise<void>;
  fetchInventoryTags: (inventoryId: string) => Promise<void>;
  deleteItems: (inventoryId: string, itemIds: string[]) => Promise<void>;
  clearInventory: () => void;

  updateTitle: (title: string) => void;
  updateDescription: (description?: string | null) => void;
  updateIsPublic: (isPublic: boolean) => void;
  updateTags: (tags: string[] | null) => void;
  updateCategory: (category: string) => void;

  addCustomField: (field: CustomFieldInput) => void;
  deleteSelectedCustomFields: (keys: string[]) => void;

  updateCustomId: (data: Partial<ICustomIdType>) => void;

  commitChanges: () => void;
  hasChanges: () => boolean;
}

const useThisInventoryStore = create<ThisInventoryState>((set, get) => ({
  invData: null,
  invUpdateData: null,
  items: [],
  inventoryTags: [],
  loading: false,
  itemsLoading: false,
  tagsLoading: false,

  fetchInventory: async (id: string) => {
    set({ loading: true });
    try {
      const response = await InventoryService.getInventory(id);
      set({ invData: response.data, invUpdateData: response.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchInventoryTags: async (inventoryId: string) => {
    set({ tagsLoading: true });
    try {
      const response = await tagService.getInventoryTags(inventoryId);
      set({ inventoryTags: response.data });
    } finally {
      set({ tagsLoading: false });
    }
  },

  createInventory: async () => {
    set({ loading: true });
    try {
      const response = await InventoryService.createInventory();
      set({ invData: response.data, invUpdateData: response.data });
    } finally {
      set({ loading: false });
    }
  },

  updateInventory: async () => {
    const { invUpdateData } = get();
    if (!invUpdateData) return;

    set({ loading: true });
    try {
      await InventoryService.updateInventory(invUpdateData.inventory.id, invUpdateData);
      set({ invData: invUpdateData });

    } finally {
      set({ loading: false });
    }
  },

  fetchThisInventoryItems: async (id: string, search = "", skip = 0, take = 20) => {
    set({ itemsLoading: true });
    try {
      const response = await ItemService.getItems(id, search, skip, take);
      set({ items: response.data });
    } finally {
      set({ itemsLoading: false });
    }
  },

  deleteItems: async (inventoryId: string, itemIds: string[]) => {
    if (!itemIds || itemIds.length === 0) return;
    set({ itemsLoading: true });
    try {
      await ItemService.deleteMany(inventoryId, itemIds);
      set({
        items: get().items.filter(item => !itemIds.includes(item.id)),
      });
    } finally {
      set({ itemsLoading: false });
    }
  },

  clearInventory: () => set({ invData: null, invUpdateData: null, items: [], inventoryTags: [] }),

  updateTitle: (title: string) =>
    set(state => ({
      invUpdateData: state.invUpdateData
        ? { ...state.invUpdateData, inventory: { ...state.invUpdateData.inventory, title } }
        : null,
    })),

  updateDescription: (description?: string | null) =>
    set(state => ({
      invUpdateData: state.invUpdateData
        ? { ...state.invUpdateData, inventory: { ...state.invUpdateData.inventory, description } }
        : null,
    })),

  updateIsPublic: (isPublic: boolean) =>
    set(state => ({
      invUpdateData: state.invUpdateData
        ? { ...state.invUpdateData, inventory: { ...state.invUpdateData.inventory, isPublic } }
        : null,
    })),

  updateTags: (tags: string[] | null) =>
    set(state => ({
      invUpdateData: state.invUpdateData ? { ...state.invUpdateData, tags } : null,
      inventoryTags: tags ? tags.map(name => ({ id: crypto.randomUUID(), name })) : [],
    })),

  updateCategory: (category: string) =>
    set(state => ({
      invUpdateData: state.invUpdateData ? { ...state.invUpdateData, category } : null,
    })),

  updateCustomId: (data: Partial<ICustomIdType>) => {
    const state = get();
    if (!state.invUpdateData) return;

    const prev = state.invUpdateData.customIdType;

    set({
      invUpdateData: {
        ...state.invUpdateData,
        customIdType: {
          ...prev,
          ...data,
          fixedText:
            data.fixedText !== undefined
              ? data.fixedText === ""
                ? ""
                : data.fixedText
              : prev.fixedText,
        },
      },
    });
    console.log(state.invUpdateData.customIdType.fixedText);
  },

  addCustomField: async field => {
    const state = get();
    if (!state.invUpdateData) throw new Error("No inventory data");

    const { type, name, description, visible } = field;
    const fields = state.invUpdateData.inventory.customFields[type];

    const activeCount = fields.filter(f => f.state !== "NONE").length;
    if (activeCount >= 3) {
      throw new Error(`Cannot add more than 3 fields of type "${type}"`);
    }

    const emptyField = [...fields]
      .sort((a, b) => {
        const aNum = parseInt(a.key.match(/\d+$/)?.[0] || "9999");
        const bNum = parseInt(b.key.match(/\d+$/)?.[0] || "9999");
        return aNum - bNum;
      })
      .find(f => f.state === "NONE");

    if (!emptyField) {
      throw new Error(`No available slot for type "${type}"`);
    }

    const nextOrder = findNextOrder(state.invUpdateData.inventory.customFields);

    const updatedField: ICustomField<any> = {
      ...emptyField,
      name,
      description,
      order: nextOrder,
      state: visible ? "VISIBLE" : "NOT_VISIBLE",
    };

    const updatedFields = fields.map(f => (f.key === emptyField.key ? updatedField : f));

    set({
      invUpdateData: {
        ...state.invUpdateData,
        inventory: {
          ...state.invUpdateData.inventory,
          customFields: {
            ...state.invUpdateData.inventory.customFields,
            [type]: updatedFields,
          },
        },
      },
    });
  },

  deleteSelectedCustomFields: (keys: string[]) => {
    const state = get();
    if (!state.invUpdateData) return;

    const updatedCustomFields = { ...state.invUpdateData.inventory.customFields };

    Object.keys(updatedCustomFields).forEach(type => {
      updatedCustomFields[type as keyof typeof updatedCustomFields] = updatedCustomFields[
        type as keyof typeof updatedCustomFields
      ].map(f =>
        keys.includes(f.key)
          ? { ...f, name: null, description: null, order: null, state: "NONE" }
          : f
      );
    });

    set({
      invUpdateData: {
        ...state.invUpdateData,
        inventory: {
          ...state.invUpdateData.inventory,
          customFields: updatedCustomFields,
        },
      },
    });
  },

  commitChanges: () =>
    set(state => ({
      invData: state.invUpdateData ? { ...state.invUpdateData } : state.invData,
    })),

  hasChanges: () => {
    const { invData, invUpdateData } = get();
    return JSON.stringify(invData) !== JSON.stringify(invUpdateData);
  },
}));

export default useThisInventoryStore;

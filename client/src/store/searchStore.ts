import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  clearSearch: () => void;
  isClear: boolean;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  isClear: true,
  setSearchTerm: (value) => set({ searchTerm: value, isClear: false }),
  clearSearch: () => set({ searchTerm: "", isClear: true}),
}));

export default useSearchStore;
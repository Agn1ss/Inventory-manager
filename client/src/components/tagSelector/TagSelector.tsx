import { useEffect, useState, useRef } from "react";
import SearchInput from "../common/SearchInput";
import useInventoryListStore from "../../store/inventoryListStore";
import useThisInventoryStore from "../../store/thisInventoryStore";
import type { ITag } from "../../models/interface/ITag";
import { v4 as uuidv4 } from "uuid";
import SelectedTags from "./SelectedTags";

export default function TagSelector() {
  const { tagList, fetchTags } = useInventoryListStore();
  const { inventoryTags, updateTags, invUpdateData, tagsLoading, fetchInventoryTags } =
    useThisInventoryStore();

  const [tags, setTags] = useState<ITag[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (invUpdateData?.inventory?.id && !initialized.current) {
      fetchInventoryTags(invUpdateData.inventory.id);
    }
  }, [invUpdateData]);

  useEffect(() => {
    if (!tagsLoading && !initialized.current) {
      setTags(inventoryTags);
      initialized.current = true;
    }
  }, [tagsLoading]);

  const handleAdd = (tag: ITag) => {
    const existingByName = tags.find(t => t.name === tag.name);

    if (tag.id === "newItem") {
      if (existingByName) return;
      tag = { ...tag, id: uuidv4() };
    } else {
      if (tags.find(t => t.id === tag.id)) return;
    }

    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    updateTags(updatedTags.map(t => t.name));
  };

  const handleRemove = (id: string) => {
    const updated = tags.filter(t => t.id !== id);
    setTags(updated);
    updateTags(updated.map(t => t.name));
  };

  const handleFetch = (query: string) => {
    fetchTags(query, 8, true);
  };

  return (
    <div>
      <SearchInput
        placeholder="Search tags..."
        fetchData={handleFetch}
        items={tagList.data}
        loading={tagList.loading}
        onSelect={handleAdd}
      />
      {tagsLoading ? (
            <span className="mt-2">Loading...</span>
      ) : (
        <SelectedTags tags={tags} onRemove={handleRemove} />
      )}
    </div>
  );
}

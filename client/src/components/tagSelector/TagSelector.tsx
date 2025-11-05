import React, { useState } from "react";
import SearchInput from "../common/SearchInput";
import SelectedTags from "./SelectedTags";
import useInventoryListStore from "../../store/inventoryListStore";
import useThisInventoryStore from "../../store/thisInventoryStore";
import type { ITag } from "../../models/interface/ITag";

export default function TagSelector() {
  const { tagList, fetchTags } = useInventoryListStore();
  const { inventoryTags } = useThisInventoryStore();
  const [tags, setTags] = useState<ITag[]>(inventoryTags);

  const handleAdd = (tag: ITag) => {
    if (!tags.find((t) => t.id === tag.id)) {
      setTags([...tags, tag]);
      
    }
  };

  const handleRemove = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
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
      <SelectedTags tags={tags} onRemove={handleRemove} />
    </div>
  );
}

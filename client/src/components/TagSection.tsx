import React, { useEffect, useState } from "react";
import useInventoryListStore from "../store/inventoryListStore";
import TagButton from "./TagButton";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const TagSection: React.FC = () => {
  const { tagList, fetchTags, fetchInventoriesByTag, selectedTagName } = useInventoryListStore();
  const { t } = useTranslation();
  const [localSelectTag, setLocalSelectTag] = useState<string | null>(null)

  useEffect(() => {
    fetchTags("",20).catch(err => {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
    });
  }, [fetchTags]);

  const handleSelect = async (tagId: string) => {
    try {
      setLocalSelectTag(tagId)
      await fetchInventoriesByTag(tagId);
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
      setLocalSelectTag(null)
    }
  };

  useEffect(() => {
    if(!selectedTagName) {
      setLocalSelectTag(null)
    }
  }, [selectedTagName]);

  

  return (
    <div className="tag-section mb-6">
      <h3 className="text-lg font-semibold mb-2">{t("tags")}</h3>
      <div className="flex flex-wrap">
        {tagList.loading ? (
          <p>Loading...</p>
        ) : (
          tagList.data.map(tag => (
            <TagButton
              key={tag.id}
              name={tag.name}
              isSelected={localSelectTag === tag.id}
              onSelectTag={() => handleSelect(tag.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TagSection;


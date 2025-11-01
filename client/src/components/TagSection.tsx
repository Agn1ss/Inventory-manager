import React, { useEffect } from "react";
import useInventoryStore from "../store/inventoryStore";
import Tag from "./Tag";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const TagSection: React.FC = () => {
  const { tagList, fetchTags, fetchInventoriesByTag, selectedTagName } = useInventoryStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchTags("").catch(err => {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
    });
  }, [fetchTags]);

  const handleSelect = async (tagId: string) => {
    try {
      await fetchInventoriesByTag(tagId);
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
    }
  };

  return (
    <div className="tag-section mb-6">
      <h3 className="text-lg font-semibold mb-2">{t("tags")}</h3>
      <div className="flex flex-wrap">
        {tagList.loading ? (
          <p>Loading...</p>
        ) : (
          tagList.data.map(tag => (
            <Tag
              key={tag.id}
              name={tag.name}
              isSelected={selectedTagName === tag.name}
              onSelectTag={() => handleSelect(tag.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TagSection;


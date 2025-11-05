import React from "react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import type { InventoryResponse } from "../../../models/response/InventoryResponse";

interface InventoryInfoBoxProps {
  inventoryData: InventoryResponse;
}

const InventoryInfoBox: React.FC<InventoryInfoBoxProps> = ({ inventoryData }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 mb-3 border rounded bg-body-tertiary text-center ">
      <h5 className="mb-3 fw-semibold">{t("information")}</h5>

      <div className="mb-1 d-flex justify-content-center flex-wrap">
        <span className="fw-bold">{t("category")}: </span>
        <span className="text-body-secondary">{inventoryData.category}</span>
      </div>
      <div className="mb-2">
        <span
          className={
            inventoryData.inventory.isPublic
              ? "text-success fw-semibold"
              : "text-warning fw-semibold"
          }
        >
          {inventoryData.inventory.isPublic ? t("public_inventory") : t("limited_access")}
        </span>
      </div>

      <div className="mt-2">
        <span className="fw-bold d-block mb-1">{t("tags")}:</span>
        <div className="d-flex flex-wrap justify-content-center gap-1">
          {inventoryData.tags && inventoryData.tags.length > 0 ? (
            inventoryData.tags.map((n, index) => <Tag key={index} name={n} />)
          ) : (
            <span className="text-body-secondary">{t("none")}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryInfoBox;

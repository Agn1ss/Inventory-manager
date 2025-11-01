import { useTranslation } from "react-i18next";
import type InventoriesDataResponse from "../models/response/InvDataResponse";
import InventoryRow from "./InventoryRow";

interface InventoryTableProps {
  data: InventoriesDataResponse[];
}

export default function InventoryTableBox({ data }: InventoryTableProps) {
  const { t } = useTranslation();
  return (
    <table className="table text-start align-middle">
      <thead>
        <tr>
          <th>{t("title")}</th>
          <th className="text-center">{t("description")}</th>
          <th>{t("creator")}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <InventoryRow row={row} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

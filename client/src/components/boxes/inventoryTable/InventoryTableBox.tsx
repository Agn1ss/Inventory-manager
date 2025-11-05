import { useTranslation } from "react-i18next";
import type InventorylistDataResponse from "../../../models/response/InventorylistDataResponse";
import InventoryRow from "./InventoryRow";

interface InventoryTableProps {
  inventoriesData: InventorylistDataResponse[];
}

export default function InventoryTableBox({ inventoriesData: data }: InventoryTableProps) {
  const { t } = useTranslation();
  return (
    <table className="table table-hover text-start align-middle">
      <thead>
        <tr>
          <th>{t("title")}</th>
          <th className="text-center">{t("description")}</th>
          <th>{t("creator")}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
            <InventoryRow row={row} />
        ))}
      </tbody>
    </table>
  );
}

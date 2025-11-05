import TablePlaceholder from "../components/placeholders/TablePlaceholder";
import InventoryTableBox from "./boxes/inventoryTable/InventoryTableBox";
import { useTranslation } from "react-i18next";

interface SearchResultSectionProps {
  title: string;
  columns: string[];
  data: any;
  loading: boolean;
}

const SearchResultSection: React.FC<SearchResultSectionProps> = ({
  title,
  columns,
  data,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="inventory-section mb-2 p-4 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <TablePlaceholder columns={columns} rows={8} />
      ) : (
        <>
          {data.length ? (
            <InventoryTableBox inventoriesData={data} />
          ) : (
            <h4 className="text-xl text-secondary font-semibold m-5 w-50 mx-auto text-center">
              {t("no_results_found")}
            </h4>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultSection;

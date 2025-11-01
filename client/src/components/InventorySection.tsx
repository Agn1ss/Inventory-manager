import React, { useEffect } from "react";
import TablePlaceholder from "../components/placeholders/TablePlaceholder";
import InventoryTableBox from "../components/InventoryTableBox";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";

interface InventorySectionProps {
  title: string;
  columns: string[];
  fetchData: () => void;
  data: any;
  loading: boolean;
}

const InventorySection: React.FC<InventorySectionProps> = ({ title, columns, fetchData, data, loading }) => {
  useEffect(() => {
    try {
      fetchData();
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
    }
  }, [fetchData]);

  return (
    <div
      className="inventory-section mb-2 p-4 rounded-2xl shadow-sm"
      style={{
        borderStyle: "solid",
        borderWidth: "2px",
        borderRadius: "10px",
        borderColor: "currentColor",
        backgroundColor: "inherit",
      }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <TablePlaceholder columns={columns} rows={5} />
      ) : (
        <InventoryTableBox data={data} />
      )}
    </div>
  );
};

export default InventorySection;
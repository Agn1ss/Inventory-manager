import React, { useEffect } from "react";
import TablePlaceholder from "../components/placeholders/TablePlaceholder";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";

interface InventorySectionProps {
  title: string;
  columns: string[];
  fetchData?: () => void;
  loading: boolean;
  rowsPlaceholder?: number;
  children?: React.ReactNode;
  withBorder?: boolean;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  title,
  columns,
  fetchData,
  loading,
  rowsPlaceholder = 5,
  children,
  withBorder = true,
}) => {
  if (fetchData) {
    useEffect(() => {
      const loadData = async () => {
        try {
          await fetchData();
        } catch (err) {
          const message = ApiErrorHandler.handle(err);
          toast.error(message);
        }
      };

      loadData();
    }, [fetchData]);
  }

  return (
    <div
      className="inventory-section mb-2 p-4 rounded-2xl"
      style={{
        borderStyle: withBorder ? "solid" : "none",
        borderWidth: withBorder ? "2px" : "0",
        borderRadius: "10px",
        borderColor: "currentColor",
        backgroundColor: "inherit",
      }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? <TablePlaceholder columns={columns} rows={rowsPlaceholder} /> : children}
    </div>
  );
};

export default InventorySection;

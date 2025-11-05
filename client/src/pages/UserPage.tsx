import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import InventorySection from "../components/InventorySection";
import useInventoryListStore from "../store/inventoryListStore";
import { COLUMNS } from "../utils/data/names";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import type UserInventoryDataResponse from "../models/response/UserInventoryDataResponse";
import type InventorylistDataResponse from "../models/response/InventorylistDataResponse";
import useSearchStore from "../store/searchStore";
import { useTranslation } from "react-i18next";
import NavBox from "../components/boxes/navigation/NavBox";
import EditableInventoryTableBox from "../components/boxes/editbleInventoryTable/EditbleInvetoryTableBox";
import InventoryTableBox from "../components/boxes/inventoryTable/InventoryTableBox";
import useThisInventoryStore from "../store/thisInventoryStore";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const { t } = useTranslation();
  const { searchTerm } = useSearchStore();
  const navigate = useNavigate();
  const {
    userInventories,
    userEditableInventories,
    fetchUserInventories,
    fetchUserEditableInventories,
    deleteUserInventories,
  } = useInventoryListStore();
  const { createInventory, invData } = useThisInventoryStore();

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<"my" | "editable">("my");

  const pages = [
    { type: "my", title: t("my_inventories") },
    { type: "editable", title: t("with_write_access") },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserInventories(searchTerm);
        await fetchUserEditableInventories(searchTerm);
      } catch (err) {
        const message = ApiErrorHandler.handle(err);
        toast.error(message);
      }
    };
    fetchData();
  }, [fetchUserInventories, fetchUserEditableInventories, searchTerm]);

  const currentRows = useMemo(() => {
    return currentPage === "my" ? userInventories.data : userEditableInventories.data;
  }, [currentPage, userInventories.data, userEditableInventories.data]);

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.entries(selectedRows)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (idsToDelete.length === 0) return;
    try {
      await deleteUserInventories(idsToDelete);
      setSelectedRows({});
      toast.success(t("delete") + " " + t("successful"));
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message);
    }
  };

  const handleCreateInventory = async () => {
    const toastId = toast.loading(t("loading"));
    try {
      setSelectedRows({});
      await createInventory();
      toast.success("Inventory created successfully!", { id: toastId });
      navigate(`/inventory/${invData?.inventory.id}/edit`);
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <>
      <Header searchPlaceholder="search_inv" />
      <Container fluid className="m-0 w-80 mt-5">
        <Row>
          <Col md={2} className="d-flex flex-column gap-3" style={{ marginTop: "84px" }}>
            <NavBox
              pages={pages}
              onTypeChange={type => setCurrentPage(type as "my" | "editable")}
            />
          </Col>

          <Col md={8} className="d-flex flex-column gap-3">
            <InventorySection
              title={t(currentPage === "my" ? "my_inventories" : "editable_inventories")}
              columns={COLUMNS}
              loading={
                currentPage === "my" ? userInventories.loading : userEditableInventories.loading
              }
              withBorder={false}
            >
              <Container fluid className="mb-3">
                <Row className="align-items-center">
                  {currentPage === "my" && (
                    <Col className="d-flex gap-2 px-0">
                      <Button variant="outline-danger" onClick={handleDeleteSelected}>
                        {t("delete")}
                      </Button>
                    </Col>
                  )}
                  <Col className="d-flex justify-content-end px-0">
                    <Button variant="success" onClick={handleCreateInventory}>
                      {t("new_inv")}
                    </Button>
                  </Col>
                </Row>
              </Container>

              {currentRows.length ? (
                currentPage === "my" ? (
                  <EditableInventoryTableBox
                    inventoriesData={currentRows as UserInventoryDataResponse[]}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                  />
                ) : (
                  <InventoryTableBox inventoriesData={currentRows as InventorylistDataResponse[]} />
                )
              ) : (
                <h4 className="text-xl text-secondary font-semibold m-5 w-50 mx-auto text-center">
                  {t("inventories_not_found")}
                </h4>
              )}
            </InventorySection>
          </Col>
        </Row>
      </Container>
    </>
  );
}

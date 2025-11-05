import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Header from "../components/Header";
import useThisInventoryStore from "../store/thisInventoryStore";
import MarkdownTooltipTrigger from "../components/MarkdownTooltipTrigger";
import InventoryItemsTableBox from "../components/boxes/inventoryItemsTable/InventoryItemsTableBox";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import useSearchStore from "../store/searchStore";
import { useTranslation } from "react-i18next";
import InventoryInfoBox from "../components/boxes/inventoryInfo/InventoryInfoBox";
import useInventoryListStore from "../store/inventoryListStore";

export default function InventoryItemsPage() {
  const { id: inventoryId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    invData,
    items,
    loading,
    itemsLoading,
    fetchInventory,
    fetchThisInventoryItems,
    deleteItems,
    clearInventory,
  } = useThisInventoryStore();
  const { deleteUserInventories } = useInventoryListStore();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { searchTerm } = useSearchStore();

  useEffect(() => {
    if (inventoryId) {
      fetchInventory(inventoryId);
    } else {
      toast.error("inventory not found");
      navigate(`/`);
    }
  }, [inventoryId]);

  useEffect(() => {
    if (!inventoryId) return;

    fetchThisInventoryItems(inventoryId, searchTerm).catch(err => {
      toast.error(ApiErrorHandler.handle(err));
    });
  }, [inventoryId, searchTerm]);

  const handleDeleteSelected = async () => {
    const toastId = toast.loading(t("loading"));
    const idsToDelete = Object.entries(selectedRows)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (idsToDelete.length === 0) {
      toast.error("Ничего не выбрано", { id: toastId });
      return;
    }

    if (!inventoryId) return;
    try {
      await deleteItems(inventoryId, idsToDelete);
      setSelectedRows({});
      toast.success(t("delete") + " " + t("successful"), { id: toastId });
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message, { id: toastId });
    }
  };

  const handleDeleteInventory = async () => {
    const toastId = toast.loading(t("loading"));
    if (!inventoryId) return;

    try {
      await deleteUserInventories([inventoryId]);
      await clearInventory();
      toast.success(t("delete") + " " + t("successful"), { id: toastId });
      navigate("/");
    } catch (err) {
      const message = ApiErrorHandler.handle(err);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <>
      <Header searchPlaceholder="search_items" />
      <Container fluid className="m-0 w-80 mt-5">
        <Row>
          {loading || !invData ? (
            <Col md={8} className="mx-auto mb-4">
              <Spinner animation="border" />
            </Col>
          ) : (
            <Col md={8} className="mx-auto mb-4">
              <h2>{invData.inventory.title}</h2>
              {invData.inventory.description ? (
                <MarkdownTooltipTrigger content={invData.inventory.description}>
                  {invData.inventory.description}
                </MarkdownTooltipTrigger>
              ) : (
                <h4 className="text-secondary">{t("no_description")}</h4>
              )}
            </Col>
          )}
        </Row>
        <Row>
          {invData && (
            <>
              <Col md={2}>
                <InventoryInfoBox inventoryData={invData} />
              </Col>

              {itemsLoading ? (
                <Col md={8} className="mx-auto mb-4">
                  <Spinner animation="border" />
                </Col>
              ) : (
                <Col md={8}>
                  <Container fluid className="mb-3">
                    <Row className="align-items-center">
                      {items.length !== 0 && (
                        <Col className="d-flex gap-2 px-0">
                          <Button variant="outline-danger" onClick={handleDeleteSelected}>
                            {t("delete")}
                          </Button>
                        </Col>
                      )}
                      <Col className="d-flex justify-content-end px-0">
                        <Button variant="success">{t("add_item")}</Button>
                      </Col>
                    </Row>
                  </Container>
                  {items.length === 0 ? (
                    <h5 className="mb-3 fw-semibold">{t("no_results_found")}</h5>
                  ) : (
                    <InventoryItemsTableBox
                      inventoryData={invData}
                      itemsData={items}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                    />
                  )}
                </Col>
              )}
              <Col md={2} className="mx-auto mb-4">
                <Row className="m-2 mt-0">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/inventory/${inventoryId}/edit`)}
                  >
                    {t("edit_inventory")}
                  </Button>
                </Row>
                <Row className="m-2">
                  <Button variant="danger" onClick={handleDeleteInventory}>
                    {t("delete_inventory")}
                  </Button>
                </Row>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
}

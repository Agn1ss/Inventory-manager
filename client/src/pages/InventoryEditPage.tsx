import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Header from "../components/Header";
import useThisInventoryStore from "../store/thisInventoryStore";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import { useTranslation } from "react-i18next";
import NavBox from "../components/boxes/navigation/NavBox";
import FieldsEditor from "../components/FieldsEditor";
import useUpdateTrigger from "../utils/hooks/useUpdateTrigger";

const pages = [
  { type: "inventory", title: "Инвентарь" },
  { type: "customId", title: "Custom ID" },
  { type: "access", title: "Доступ" },
  { type: "stats", title: "Статистика" },
];

export default function InventoryItemsPage() {
  const { id: inventoryId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { updateTrigger, triggerUpdate: handleUpdate } = useUpdateTrigger({
    intervalMs: 1000 * 60000,
  });

  const { invData, invUpdateData, loading, fetchInventory, updateInventory, hasChanges } =
    useThisInventoryStore();
  const [currentPage, setCurrentPage] = useState<string>("inventory");

  useEffect(() => {
    if (inventoryId) {
      fetchInventory(inventoryId).catch(err => {
        toast.error(ApiErrorHandler.handle(err));
      });
    } else {
      toast.error("inventory not found");
      navigate(`/`);
    }
  }, [inventoryId]);

  useEffect(() => {
    const updateData = async () => {
      if (hasChanges()) {
        const toastId = toast.loading(t("loading"));
        try {
          await updateInventory();
          toast.success(`${t("update")} ${t("successful")}`, { id: toastId });
        } catch (error) {
          const message = ApiErrorHandler.handle(error);
          toast.error(message, { id: toastId });
        }
      }
    };

    updateData();
  }, [updateTrigger]);

  const pageComponents: Record<string, JSX.Element> = {
    inventory: (
      <Col md={8} className="mx-auto mb-4">
        <FieldsEditor />
      </Col>
    ),
    customId: (
      <Col md={8} className="mx-auto mb-4">
        <h4>{t("Редактор Custom ID")}</h4>
      </Col>
    ),
    access: (
      <Col md={8} className="mx-auto mb-4">
        <h4>{t("Настройки доступа")}</h4>
      </Col>
    ),
    stats: (
      <Col md={8} className="mx-auto mb-4">
        <h4>{t("Статистика инвентаря")}</h4>
      </Col>
    ),
  };

  const renderPageContent = () => {
    if (loading) {
      return (
        <Col md={8} className="mx-auto mb-4">
          <Spinner animation="border" />
        </Col>
      );
    }
    return pageComponents[currentPage] || null;
  };

  return (
    <>
      <Header />
      <Container fluid className="m-0 w-80 mt-5">
        <Row>
          {invData ? (
            <>
              <Col md={2}>
                <NavBox pages={pages} onTypeChange={setCurrentPage} />
              </Col>

              {renderPageContent()}

              <Col md={2} className="mx-auto mb-4">
                <Row className="m-2 mt-0">
                  <Button variant="primary" onClick={handleUpdate}>
                    Применить изменения
                  </Button>
                </Row>
              </Col>
            </>
          ) : (
            <Col md={12} className="mx-auto mb-4">
              <Spinner animation="border" />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

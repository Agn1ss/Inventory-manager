import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Header from "../components/Header";
import useThisInventoryStore from "../store/thisInventoryStore";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import { useTranslation } from "react-i18next";
import NavBox from "../components/boxes/navigation/NavBox";
import useUpdateTrigger from "../utils/hooks/useUpdateTrigger";
import FieldUpdateForm from "../components/FieldUpdateForm";
import CustomIdUpdateForm from "../components/CustomIdUpdateForm";
import type { ICustomIdType } from "../models/interface/ICustomIdType";

const pages = [
  { type: "inventory", titleKey: "inventory" },
  { type: "customId", titleKey: "custom_id_editor" },
  { type: "access", titleKey: "access_settings" },
  { type: "stats", titleKey: "inventory_stats" },
];

export default function InventoryEditPage() {
  const { id: inventoryId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { updateTrigger, triggerUpdate: handleUpdate } = useUpdateTrigger({
    intervalMs: 1000 * 60000,
  });

  const { invData, invUpdateData, loading, fetchInventory, updateInventory, hasChanges } =
    useThisInventoryStore();
  const [currentPage, setCurrentPage] = useState<string>("inventory");
  const [customIdData, setCustomIdData] = useState<ICustomIdType | null>(null);

  useEffect(() => {
    if (inventoryId) {
      fetchInventory(inventoryId).catch(err => {
        toast.error(ApiErrorHandler.handle(err));
      });
    } else {
      toast.error(t("errors.inventory_not_found"));
      navigate(`/`);
    }
  }, [inventoryId]);

  useEffect(() => {
    if (invUpdateData?.customIdType && !customIdData) {
      setCustomIdData(invUpdateData.customIdType);
    }
  }, [invUpdateData, customIdData]);

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
        <FieldUpdateForm />
      </Col>
    ),
    customId: (
      <Col md={8} className="mx-auto mb-4">
        <h4 className="mb-4">{t("custom_id_editor")}</h4>
        {customIdData && (
          <Row>
            <Col md={8} className="mx-auto">
              <CustomIdUpdateForm customIdData={customIdData} setCustomIdData={setCustomIdData} />
            </Col>
          </Row>
        )}
      </Col>
    ),
    access: (
      <Col md={8} className="mx-auto mb-4">
        <h4>{t("access_settings")}</h4>
      </Col>
    ),
    stats: (
      <Col md={8} className="mx-auto mb-4">
        <h4>{t("inventory_stats")}</h4>
      </Col>
    ),
  };

  const renderPageContent = () => {
    if (loading) {
      return (
        <Col md={8} className="mx-auto mb-4 text-center">
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
                <NavBox
                  pages={pages.map(p => ({ ...p, title: t(p.titleKey) }))}
                  onTypeChange={setCurrentPage}
                />
                <Button variant="success" className="my-2 w-100 text-start" onClick={handleUpdate}>
                  {t("apply_changes")}
                </Button>
              </Col>

              {renderPageContent()}

              <Col md={2} className="mx-auto mb-4"></Col>
            </>
          ) : (
            <Col md={12} className="mx-auto mb-4 text-center">
              <Spinner animation="border" />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

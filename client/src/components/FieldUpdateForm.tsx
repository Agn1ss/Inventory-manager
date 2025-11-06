import { useEffect, useState } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useValidationField from "../utils/hooks/useValidationField";
import { TITLE_RULES } from "../utils/data/validatationRules";
import useThisInventoryStore from "../store/thisInventoryStore";
import TagSelector from "./tagSelector/TagSelector";
import CustomFieldEditor from "./CustomFieldEditor";
import type { ICustomFields } from "../models/interface/IInventory";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import CustomFieldsTable from "./boxes/customField/СustomFieldsTable";

interface FieldUpdateFormProps {}

export default function FieldUpdateForm({}: FieldUpdateFormProps) {
  const { t } = useTranslation();
  const { invUpdateData, updateTitle, updateDescription, deleteSelectedCustomFields } =
    useThisInventoryStore();

  const [title, setTitle] = useState<string>(invUpdateData?.inventory.title || "");
  const [description, setDescription] = useState<string>(
    invUpdateData?.inventory.description || ""
  );

  const [titleErrors, isTitleValid] = useValidationField(title, TITLE_RULES);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isTitleValid) {
      updateTitle(title);
    }
    updateDescription(description);
  }, [title, description]);

  const hadleDeleteSelectedFields = async () => {
    const keysToDelete = Object.entries(selectedFields)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);

    if (keysToDelete.length === 0) {
      toast.error(t("nothing_selected"));
      return;
    }
    try {
      await deleteSelectedCustomFields(keysToDelete);
      setSelectedFields({});
    } catch (error) {
      const message = ApiErrorHandler.handle(error, "customField");
      toast.error(message);
    }
  };

  const customFields: ICustomFields | undefined = invUpdateData?.inventory.customFields;

  return (
    <Form>
      <Form.Group className="form-floating mb-3 w-50" style={{ maxWidth: "40%" }}>
        <Form.Control
          type="text"
          id="floatingTitle"
          placeholder={t("title")}
          value={title}
          onChange={e => setTitle(e.target.value)}
          isInvalid={!isTitleValid}
          maxLength={35}
          className="btn-lg form-control-lg rounded-3"
        />
        <Form.Label htmlFor="floatingTitle">{t("title")}</Form.Label>
        <Form.Control.Feedback type="invalid">{titleErrors[0]}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="form-floating mb-3">
        <Form.Control
          as="textarea"
          id="floatingDescription"
          placeholder={t("description")}
          style={{ height: "120px" }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={1000}
        />
        <Form.Label htmlFor="floatingDescription">{t("description")}</Form.Label>
      </Form.Group>

      <Row>
        <Col md={8}>
          <CustomFieldEditor />
        </Col>
        <Col md={4} style={{maxWidth: 245}}>
          <Form.Group className="mb-3">
            <TagSelector />
          </Form.Group>
        </Col>
      </Row>

      {customFields && (
        <div className="mt-4">
          <Row className="mb-2 align-items-center">
            <Col md={2} className="d-flex justify-content-start">
              <Button
                variant="outline-secondary"
                onClick={hadleDeleteSelectedFields}
                aria-label={t("delete_selected_fields")}
              >
                🗑️
              </Button>
            </Col>
            <Col md={8}>
              <h5>{t("custom_fields")}</h5>
            </Col>
          </Row>

          <CustomFieldsTable
            customFields={customFields}
            selectedRows={selectedFields}
            setSelectedRows={setSelectedFields}
          />
        </div>
      )}
    </Form>
  );
}

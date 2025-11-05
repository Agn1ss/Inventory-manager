import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useValidationField from "../utils/hooks/useValidationField";
import { TITLE_RULES } from "../utils/data/validatationRules";
import useThisInventoryStore from "../store/thisInventoryStore";
import TagSelector from "./tagSelector/TagSelector";
import CustomFieldEditor from "./CustomFieldEditor";

interface NewInventoryFormProps {}

export default function NewInventoryForm({}: NewInventoryFormProps) {
  const { t } = useTranslation();
  const {
    invUpdateData,
    updateTitle,
    updateDescription,
    inventoryTags,
    fetchInventoryTags,
    invData,
    updateTags,
  } = useThisInventoryStore();

  const [title, setTitle] = useState<string>(invUpdateData?.inventory.title || "");
  const [description, setDescription] = useState<string>(
    invUpdateData?.inventory.description || ""
  );

  const [titleErrors, isTitleValid] = useValidationField(title, TITLE_RULES);

  useEffect(() => {
    if (isTitleValid) {
      updateTitle(title);
    }
    updateDescription(description);
  }, [title, description]);

  useEffect(() => {
    if (invData) {
      fetchInventoryTags(invData.inventory.id);
    }
  }, []);

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
        <Col md={4}>
          <Form.Group className="mb-3">
            <TagSelector />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

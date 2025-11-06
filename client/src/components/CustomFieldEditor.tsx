import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import { TITLE_RULES } from "../utils/data/validatationRules";
import useValidationField from "../utils/hooks/useValidationField";
import type { ICustomFields } from "../models/interface/IInventory";
import useThisInventoryStore from "../store/thisInventoryStore";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface CustomFieldInput {
  name: string;
  description: string;
  type: keyof ICustomFields;
  visible: boolean;
}



export default function CustomFieldEditor({}) {
  const defaultField = {
    name: "Name",
    description: "",
    type: "string",
    visible: false,
  } as CustomFieldInput;

  const { t } = useTranslation();
  const [name, setName] = useState(defaultField.name);
  const [description, setDescription] = useState(defaultField.description);
  const [type, setType] = useState<keyof ICustomFields>(defaultField.type);
  const [visible, setVisible] = useState(defaultField.visible);
  const [nameErrors, isNameValid] = useValidationField(name, TITLE_RULES);
  const { addCustomField, invUpdateData } = useThisInventoryStore();

  const handleAdd = async () => {
    if (!isNameValid) return;
    const toastId = toast.loading(t("loading"));

    const newField: CustomFieldInput = {
      name: name.trim(),
      description: description.trim(),
      type,
      visible,
    };

    try {
      await addCustomField(newField);

      setName(defaultField.name);
      setDescription("");
      setType("string");
      setVisible(false);

      toast.success(`${t("add")} ${t("successful")}`, { id: toastId });
    } catch (error) {
      const message = ApiErrorHandler.handle(error, "customField");
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Card className="p-3 mb-3">
      <Card.Header
        as="h5"
        className="mb-3"
        style={{ backgroundColor: "transparent", border: "none", padding: 0 }}
      >
        Add Custom Field
      </Card.Header>
      <Card.Body className="px-3 py-1">
        <Row>
          <Col>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                isInvalid={!isNameValid}
                maxLength={20}
              />
              <Form.Label>Name</Form.Label>
              <Form.Control.Feedback type="invalid">{nameErrors[0]}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                value={type}
                onChange={e => setType(e.target.value as keyof ICustomFields)}
              >
                <option value="string">Single line</option>
                <option value="text">Multi line</option>
                <option value="int">Number</option>
                <option value="link">Link</option>
                <option value="bool">Boolean</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                as="textarea"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ height: "80px" }}
              />
              <Form.Label>Description</Form.Label>
            </Form.Group>
          </Col>
        </Row>
        <Row className="align-items-end">
          <Col className="d-flex align-items-end">
            <Form.Group className="mb-0 d-flex align-items-center">
              <span className="me-2 fs-6">Visible</span>
              <Form.Check
                type="checkbox"
                checked={visible}
                onChange={e => setVisible(e.target.checked)}
                style={{ margin: 0 }}
              />
            </Form.Group>
          </Col>

          <Col className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleAdd}>
              Add Field
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

import { Accordion, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import type { ICustomIdType } from "../models/interface/ICustomIdType";
import useThisInventoryStore from "../store/thisInventoryStore";
import toast from "react-hot-toast";
import { DATE_FORMATS, RANDOM_TYPES } from "../utils/data/names";
import { useTranslation } from "react-i18next";

interface CustomIdUpdateFormProps {
  customIdData: ICustomIdType;
  setCustomIdData: (data: ICustomIdType) => void;
}

export default function CustomIdUpdateForm({
  customIdData,
  setCustomIdData,
}: CustomIdUpdateFormProps) {
  const { t } = useTranslation();
  const { updateCustomId } = useThisInventoryStore();

  const handleFieldChange = (field: keyof ICustomIdType, value: any) => {
    setCustomIdData({ ...customIdData, [field]: value });
  };

  const handleSave = () => {
    const { fixedText, randomType, dateFormat, sequenceName } = customIdData;

    const isFixedTextOnly =
      fixedText &&
      fixedText.trim() !== "" &&
      !randomType &&
      !dateFormat &&
      !sequenceName;

    if (isFixedTextOnly) {
      toast.error(t("custom_id.errors.text_only"));
      return;
    }

    updateCustomId(customIdData);
    toast.success(t("custom_id.saved_locally"));
  };

  const renderTooltip = (message: string) => (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

  return (
    <Form>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip(t("custom_id.tooltip.fixed_text"))}
            >
              <span>{t("custom_id.fixed_text")}</span>
            </OverlayTrigger>
          </Accordion.Header>
          <Accordion.Body>
            <Form.Control
              type="text"
              value={customIdData.fixedText || ""}
              placeholder={t("custom_id.placeholder_missing")}
              onChange={e => handleFieldChange("fixedText", e.target.value)}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip(t("custom_id.tooltip.random_type"))}
            >
              <span>{t("custom_id.random_type")}</span>
            </OverlayTrigger>
          </Accordion.Header>
          <Accordion.Body>
            <Form.Select
              value={customIdData.randomType || "none"}
              onChange={e =>
                handleFieldChange("randomType", e.target.value === "none" ? null : e.target.value)
              }
            >
              {RANDOM_TYPES.map(opt => (
                <option key={opt} value={opt}>
                  {opt === "none" ? t("none") : opt}
                </option>
              ))}
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip(t("custom_id.tooltip.date_format"))}
            >
              <span>{t("custom_id.date_format")}</span>
            </OverlayTrigger>
          </Accordion.Header>
          <Accordion.Body>
            <Form.Select
              value={customIdData.dateFormat || "none"}
              onChange={e =>
                handleFieldChange("dateFormat", e.target.value === "none" ? null : e.target.value)
              }
            >
              {DATE_FORMATS.map(opt => (
                <option key={opt} value={opt}>
                  {opt === "none" ? t("none") : opt}
                </option>
              ))}
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-flex justify-content-between align-items-center px-1 mt-3">
        <Form.Check
          type="switch"
          id="sequenceNameSwitch"
          label={
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip(t("custom_id.tooltip.sequence"))}
            >
              <span>{t("custom_id.sequence")}</span>
            </OverlayTrigger>
          }
          checked={customIdData.sequenceName}
          onChange={e => handleFieldChange("sequenceName", e.target.checked)}
          className="ml-3"
        />

        <Button variant="success" onClick={handleSave}>
          {t("save")}
        </Button>
      </div>
    </Form>
  );
}

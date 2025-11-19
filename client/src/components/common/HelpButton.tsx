import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button, Form } from "react-bootstrap";
import ModalBox from "../modals/ModalBox";
import type { IUser } from "../../models/interface/IUser";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import TicketService from "../../services/ticketService";
import type { Ticket } from "../../models/interface/ITicket";

interface HelpButtonProps {
  inventory?: string;
  user: IUser;
  pageLink: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({
  inventory,
  user,
  pageLink,
}) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] =
  useState<"Low" | "Normal" | "High">("Normal");
  const [description, setDescription] = useState("");

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error(t("description_required"));
      return;
    }
  
    setLoading(true);
  
    const ticket: Ticket = {
      user: user.email,
      inventory: inventory ?? "Inventory is absent",
      priority,
      description,
      pageLink,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
  
    try {
      await TicketService.send(ticket);
  
      toast.success(t("ticket_sent_success"));
      setDescription("");
      handleClose();
    } catch (err) {
      toast.error(t("ticket_sent_fail"));
    }
    setLoading(false);
  };

  const button = (
    <Button
      variant="primary"
      size="sm"
      onClick={handleOpen}
      title={t("help")}
      aria-label={t("help")}
      className="d-flex align-items-center justify-content-center shadow"
      style={{
        position: "fixed",
        left: "16px",
        bottom: "16px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        zIndex: 9999,
      }}
    >
      ?
    </Button>
  );

  const modal = (
    <ModalBox
      show={showModal}
      onClose={handleClose}
      title={t("create_ticket")}
      size="sm"
    >
      <h6 className="fw-bold mb-1">{t("user")}</h6>
      <div className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
        {user.email}
      </div>

      {inventory && (
        <>
          <h6 className="fw-bold mb-1">{t("inventory")}</h6>
          <div className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
            {inventory}
          </div>
        </>
      )}

      <h6 className="fw-bold mb-2">{t("priority")}</h6>
      <Form>
        <Form.Group className="mb-3">
          <Form.Select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "Low" | "Normal" | "High")
            }
          >
            <option value="High">{t("priority_high")}</option>
            <option value="Normal">{t("priority_average")}</option>
            <option value="Low">{t("priority_low")}</option>
          </Form.Select>
        </Form.Group>

        <h6 className="fw-bold mb-2">{t("short_description")}</h6>
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            maxLength={70}
            value={description}
            placeholder={t("description_placeholder")}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

<Button variant="primary" className="w-100" onClick={handleSubmit} disabled={loading}>
  {loading ? t("sending") : t("submit_ticket")}
</Button>
      </Form>
    </ModalBox>
  );

  return (
    <>
      {createPortal(button, document.body)}
      {createPortal(modal, document.body)}
    </>
  );
};
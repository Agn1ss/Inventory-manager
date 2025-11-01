import React from "react";
import { Modal } from "react-bootstrap";

type Size = "sm" | "lg" | "xl" | undefined;

interface ModalBoxProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
  modalStyle?: React.CSSProperties;
  size?: Size;
}

export default function ModalBox({
  show,
  title,
  onClose,
  children,
  size,
  modalStyle,
}: ModalBoxProps) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size={size}>
      <Modal.Body className="p-5" style={modalStyle}>
        {title && (
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0">{title}</h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
        )}
        {children}
      </Modal.Body>
    </Modal>
  );
}
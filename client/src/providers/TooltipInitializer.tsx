import { useEffect } from "react";
import { Tooltip } from "bootstrap";

export default function TooltipInitializer() {
  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new Tooltip(tooltipTriggerEl, { html: true });
    });
  }, []);

  return null;
}

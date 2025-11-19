import { Router } from "express";
import { uploadTicketToDropbox } from "../services/dropbox-service.js";
const integrationsRouter = Router();

integrationsRouter.post("/create-ticket", async (req, res) => {
  try {
    const ticket = req.body;

    if (!ticket) {
      return res.status(400).json({ message: "No ticket data provided" });
    }

    const filePath = await uploadTicketToDropbox(ticket);

    res.json({ message: "Ticket uploaded", filePath });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default integrationsRouter;

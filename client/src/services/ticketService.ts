import $api from "../http";
import type { Ticket } from "../models/interface/ITicket";

export default class TicketService {
  static send(ticket: Ticket) {
    return $api.post("/integration/create-ticket", ticket);
  }
}

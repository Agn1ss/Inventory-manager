export interface Ticket {
  user: string;
  inventory?: string;
  priority: "High" | "Normal" | "Low";
  description: string;
  pageLink: string;
  createdAt: string;
}





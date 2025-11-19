import { Dropbox } from "dropbox";
import dotenv from "dotenv";

dotenv.config();

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN
});

export async function uploadTicketToDropbox(ticketData) {
  const json = JSON.stringify(ticketData, null, 2);
  const filePath = `/tickets/ticket_${Date.now()}.json`;

  try {
    await dbx.filesUpload({
      path: filePath,
      contents: json,
      mode: { ".tag": "add" }
    });

    console.log("File uploaded to Dropbox:", filePath);
    return filePath;
  } catch (err) {
    console.error("Dropbox upload error:", err);
    throw new Error("Failed to upload file to Dropbox");
  }
}

import { marked } from "marked";
import striptags from "striptags";

export default function markdownToText(markdown: string): string {
  const html = marked.parse(markdown, { async: false }); 
  const text = striptags(html);
  return text;
}
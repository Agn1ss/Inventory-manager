export default function getTextshorted(text: string | undefined | null, len: number): string {
  const safeText = text ?? "";
  return safeText.length > len ? safeText.slice(0, len) + "..." : safeText;
}
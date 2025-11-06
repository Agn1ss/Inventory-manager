export default function extractFieldType(key: string): string {
  const match = key.match(/^custom([A-Z][a-z]+)\d+$/);
  if (!match) return "-";
  return match[1].charAt(0).toLowerCase() + match[1].slice(1);
}
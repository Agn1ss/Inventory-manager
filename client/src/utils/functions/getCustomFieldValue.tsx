import MarkdownTooltipTrigger from "../../components/MarkdownTooltipTrigger";
import type { IItemCustomFields } from "../../models/interface/IItem";
import getTextShorted from "./getTextShorted";

const valueTypes = {
  string: (v: unknown) => {
    if (typeof v === "string") return getTextShorted(v, 20);
    return null;
  },
  text: (v: unknown) => {
    if (typeof v === "string")
      return <MarkdownTooltipTrigger content={v}>{getTextShorted(v, 30)}</MarkdownTooltipTrigger>;
    return null;
  },
  int: (v: unknown) => {
    if (typeof v === "number") return v;
    return null;
  },
  link: (v: unknown) => {
    if (typeof v === "string") return <a href={v}>{v}</a>;
    return null;
  },
  bool: (v: unknown) => {
    if (typeof v === "boolean") return v ? "✔️" : "❌";
    return null;
  },
};

export default function getFieldValue(fields: IItemCustomFields, key: string) {
  const types: (keyof IItemCustomFields)[] = ["string", "text", "int", "link", "bool"];
  for (const type of types) {
    const field = fields[type].find(f => f.key === key);
    if (field) {
      const value = valueTypes[type](field.value);
      return value !== null ? value : "-";
    }
  }
  return "-";
};
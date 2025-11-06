import type { DateFormat, RandomType } from "../../models/interface/ICustomIdType";

export const COLUMNS = ["title", "description", "creator"];

export const CustomFieldDisplayMap = {
  string: { label: "Single line", textClass: "text-success", isNumeric: false },
  text: { label: "Multi line", textClass: "text-success", isNumeric: false },
  int: { label: "Number", textClass: "text-success", isNumeric: true },
  link: { label: "Link", textClass: "text-primary", isNumeric: false },
  bool: { label: "Boolean", textClass: "text-success", isNumeric: false },
} as const;

export const FieldStateDisplayMap = {
  VISIBLE: { label: "Yes", textClass: "" },
  NOT_VISIBLE: { label: "No", textClass: "text-muted" },
  NONE: { label: "-", textClass: "" },
} as const;



export const RANDOM_TYPES: (RandomType | "none")[] = [
  "none",
  "BIT_20",
  "BIT_32",
  "DIGITS_6",
  "DIGITS_9",
  "GUID",
];

export const DATE_FORMATS: (DateFormat | "none")[] = [
  "none",
  "YYYY",
  "YYYYMMDD",
  "YYYYMMDDHHmmss",
  "YYYY_MM_DD",
  "DDMMYYYY",
];
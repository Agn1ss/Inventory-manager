import { t } from "i18next";

export const NAME_RULES = new Map<(f: string) => boolean, string>([
  [f => !f.trim(), `${t("name")} ${t("is_required")}`],
  [f => /\s/.test(f), `${t("name")} ${t("should_be_one_word")}`],
]);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_RULES = new Map<(f: string) => boolean, string>([
  [f => !f.trim(), `${t("email")} ${t("is_required")}`],
  [f => !emailRegex.test(f), `${t("email")} ${t("is_invalid")}`],
]);

export const PASS_RULES = new Map<(f: string) => boolean, string>([
  [f => !f.trim(), t("is_required")],
  [f => /\s/.test(f), t("password_no_spaces")],
  [f => !/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(f), t("password_invalid_characters")],
  [f => f.length < 5,t("password_min_length_5")],
]);

export const TITLE_RULES = new Map<(f: string) => boolean, string>([
  [f => !f.trim(), "Title is required"],
  [f => f.length > 30, "Title must be at most 30 characters"],
]);

export const DESCRIPTION_RULES = new Map<(f: string) => boolean, string>([
  [f => f.length > 1000, "Description must be at most 200 characters"],
]);

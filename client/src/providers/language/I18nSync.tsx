import { useEffect } from "react";
import i18n from "./i18";
import { useSettingsStore } from "../../store/useSettingsStore";

export function I18nSync({ children }: { children: React.ReactNode }) {
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <>{children}</>;
}
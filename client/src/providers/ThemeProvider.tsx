import { useEffect } from "react";
import { useSettingsStore } from "../store/useSettingsStore";

export default function ThemeProvider() {
  const theme = useSettingsStore(state => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return null;
}

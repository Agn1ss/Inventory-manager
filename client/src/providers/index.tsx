import React from "react";
import ThemeProvider from "./ThemeProvider";
import TooltipInitializer from "./TooltipInitializer";
import { Toaster } from "react-hot-toast";
import { I18nSync } from "./language/I18nSync";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider />
      <TooltipInitializer />
      <I18nSync>
        {children}
      </I18nSync>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

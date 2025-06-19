"use client";
import { AuthProvider } from "@/contexts/auth";
import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  detectBrowserLanguage,
  getSavedLanguage,
  saveLanguage,
} from "@/lib/locale-utils";

export function LanguageDetector() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Only run on client side and if not already initialized
    if (typeof window === "undefined" || getSavedLanguage()) return;

    try {
      const browserLanguage = detectBrowserLanguage();
      i18n.changeLanguage(browserLanguage);
      saveLanguage(browserLanguage);
    } catch (error) {
      console.warn("Language detection failed:", error);
      i18n.changeLanguage("en");
      saveLanguage("en");
    }
  }, [i18n]);

  return null;
}

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import i18n from "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for i18n to be fully initialized
    const initializeI18n = async () => {
      if (typeof window !== "undefined") {
        try {
          const savedLanguage = localStorage.getItem("language");
          if (savedLanguage && savedLanguage !== i18n.language) {
            await i18n.changeLanguage(savedLanguage);
          }
        } catch (error) {
          console.warn("Failed to initialize language:", error);
        }
      }
      setIsInitialized(true);
    };

    initializeI18n();
  }, []);

  // Show loading state to prevent flickering
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

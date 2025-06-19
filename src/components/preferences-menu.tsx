"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Settings, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import {
  supportedLanguages,
  getLanguageByCode,
  saveLanguage,
} from "@/lib/locale-utils";

export function PreferencesMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setLanguage(value);
    saveLanguage(value);
  };

  // Get current language data
  const getCurrentLanguage = () => {
    return getLanguageByCode(language);
  };

  if (!mounted) return null;

  return (
    <>
      <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
        <Settings className="mr-3 h-4 w-4" />
        {t("ui.label.preferences")}
      </button>
      <div className="pl-9 pr-3 space-y-4 mt-2 w-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{t("ui.label.theme")}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className={`size-7 rounded-md ${
                  theme === "light" ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => setTheme("light")}
                aria-label="Light theme"
              >
                <Sun className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`size-7 rounded-md ${
                  theme === "dark" ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => setTheme("dark")}
                aria-label="Dark theme"
              >
                <Moon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`size-7 rounded-md ${
                  theme === "system" ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => setTheme("system")}
                aria-label="System theme"
              >
                <Monitor className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{t("ui.label.languages")}</span>
            <div className="w-20">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-7 text-xs w-full">
                  <SelectValue>
                    <div className="flex items-center justify-center">
                      <span className="text-base">
                        {getCurrentLanguage().flag}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="min-w-[150px] max-h-[200px] overflow-y-auto"
                >
                  <SelectGroup>
                    {supportedLanguages.map((lang) => (
                      <SelectItem
                        key={lang.code}
                        value={lang.code}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

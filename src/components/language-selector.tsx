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

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export function PreferencesMenu() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Get saved language from localStorage if available
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    // In a real app, you would change the app's language here
  };

  // Get current language data
  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === language) || languages[0];
  };

  if (!mounted) return null;

  return (
    <>
      <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
        <Settings className="mr-3 h-4 w-4" />
        Preferences
      </button>
      <div className="pl-9 pr-3 space-y-4 mt-2 w-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Theme</span>
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
            <span className="text-sm font-medium">Language</span>
            <div className="w-[90px]">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue>
                    <div className="flex items-center">
                      <span>{getCurrentLanguage().flag}</span>
                      <span className="ml-2 truncate max-w-[50px]">
                        {getCurrentLanguage().name.split(" ")[0]}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end" className="min-w-[150px]">
                  <SelectGroup>
                    {languages.map((lang) => (
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

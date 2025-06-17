// Utility functions for working with locales

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "th", name: "ประเทศไทย", flag: "🇹🇭" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export const getSupportedLanguageCodes = () => {
  return supportedLanguages.map((lang) => lang.code);
};

export const getLanguageByCode = (code: string) => {
  return (
    supportedLanguages.find((lang) => lang.code === code) ||
    supportedLanguages[0]
  );
};

export const isLanguageSupported = (code: string) => {
  return supportedLanguages.some((lang) => lang.code === code);
};

// Function to detect browser language
export const detectBrowserLanguage = () => {
  if (typeof window === "undefined") return "en";

  try {
    const browserLanguage = navigator.language.split("-")[0];
    return isLanguageSupported(browserLanguage) ? browserLanguage : "en";
  } catch {
    return "en";
  }
};

// Function to get saved language from localStorage
export const getSavedLanguage = () => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("language");
  } catch {
    return null;
  }
};

// Function to save language to localStorage
export const saveLanguage = (code: string) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("language", code);
  } catch {
    console.warn("Failed to save language to localStorage");
  }
};

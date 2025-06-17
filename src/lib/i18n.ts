import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all translation files
import en from "@/locales/en.json";
import vi from "@/locales/vi.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import zh from "@/locales/zh.json";
import pt from "@/locales/pt.json";
import th from "@/locales/th.json";
import ru from "@/locales/ru.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
  pt: { translation: pt },
  th: { translation: th },
  ru: { translation: ru },
};

// Function to get initial language
function getInitialLanguage(): string {
  if (typeof window === "undefined") return "en";

  try {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) return savedLanguage;

    // Auto-detect browser language
    const browserLanguage = navigator.language.split("-")[0];
    const supportedLanguages = Object.keys(resources);

    if (supportedLanguages.includes(browserLanguage)) {
      localStorage.setItem("language", browserLanguage);
      return browserLanguage;
    }

    localStorage.setItem("language", "en");
    return "en";
  } catch {
    return "en";
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Disable suspense to prevent flickering
  },
});

export default i18n;

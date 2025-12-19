import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;
const defaultLang =
  savedLang ||
  (navigator.language && navigator.language.startsWith("en") ? "en" : "ru");

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: defaultLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

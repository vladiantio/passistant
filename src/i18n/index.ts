import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next"
import { locales } from "./languages"

i18n
  .use(resourcesToBackend((lng: keyof typeof locales) => import(`./locales/${lng}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      convertDetectedLanguage: (lng) => {
        if (lng.startsWith("es")) return "es"
        return lng
      },
    },
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: Object.keys(locales),
  })

export default i18n

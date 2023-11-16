import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguadeDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translationEN.json';
import translationES from './locales/es/translationES.json';
import translationGE from './locales/ge/translationGE.json';
import translationIT from './locales/it/translationIT.json';
import translationCH from './locales/ch/translationCH.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  ge: {
    translation: translationGE,
  },
  it: {
    translation: translationIT,
  },
  ch: {
    translation: translationCH,
  },
};

i18n
  .use(Backend)
  .use(LanguadeDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    detection: {
      order: ['queryString', 'cookie'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// Import translation files
import en from './locales/en.json';
import no from './locales/no.json';

const resources = {
  en: {
    translation: en,
  },
  no: {
    translation: no,
  },
};

// Get device locale
const deviceLocale = getLocales()[0]?.languageCode || 'no';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale.startsWith('no') ? 'no' : 'en', // Default to Norwegian if device is set to Norwegian
    fallbackLng: 'no', // Norwegian as default fallback as per requirements
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native compatibility
    },
  });

export default i18n;
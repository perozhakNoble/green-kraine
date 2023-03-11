import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getLanguageLocaleFromLocalStorage(),
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        title: 'Multi-language app',
      },
    },
    ua: {
      translation: {
        title: 'Мультимовний застосунок',
      },
    },
  },
})

export default i18n

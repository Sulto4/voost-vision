import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ro from './locales/ro.json'
import en from './locales/en.json'

// Get language from URL or localStorage
const getInitialLanguage = () => {
  const path = window.location.pathname
  if (path.startsWith('/en')) return 'en'
  if (path.startsWith('/ro')) return 'ro'

  const stored = localStorage.getItem('language')
  if (stored && ['ro', 'en'].includes(stored)) return stored

  return 'ro' // Default to Romanian
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ro: { translation: ro },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'ro',
    interpolation: {
      escapeValue: false,
    },
  })

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  document.documentElement.lang = lng
})

export default i18n

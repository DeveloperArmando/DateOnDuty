import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEs from './locales/es/common.json'
import calendarEs from './locales/es/calendar.json'
import configEs from './locales/es/config.json'
import searchEs from './locales/es/search.json'
import feedbackEs from './locales/es/feedback.json'
import onboardingEs from './locales/es/onboarding.json'

i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  ns: ['common', 'calendar', 'config', 'search', 'feedback', 'onboarding'],
  defaultNS: 'common',
  resources: {
    es: {
      common: commonEs,
      calendar: calendarEs,
      config: configEs,
      search: searchEs,
      feedback: feedbackEs,
      onboarding: onboardingEs,
    },
  },
  interpolation: {
    escapeValue: false, // React ya escapa el contenido
  },
})

export default i18n

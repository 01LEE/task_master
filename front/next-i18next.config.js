const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ja'],
    localePath: path.resolve('./public/locales'),
  },
  fallbackLng: 'ko',
  ns: ['common'],
  defaultNS: 'common',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
} 
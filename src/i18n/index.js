import { createI18n } from 'vue-i18n'
import { numberFormats } from './numbers'
import { arabicPluralRules } from './plurals'
import { datetimeFormats } from './datetimes'
import defaultMessages from '../translations/en-US.json'
import { nextTick } from 'vue'

export const supportedLocales = {
  'en-US': { name: 'English' },
  'ar-EG': { name: 'العربية (Arabic)' },
}

export const defaultLocale = 'en-US'

let _i18n

function setup(options = { locale: defaultLocale }) {
  _i18n = createI18n({
    locale: options.locale,
    fallbackLocale: defaultLocale,
    messages: { [defaultLocale]: defaultMessages },
    numberFormats,
    datetimeFormats,
    pluralizationRules: {
      'ar-EG': arabicPluralRules,
    },
  })

  setLocale(options.locale)

  return _i18n
}

function setLocale(newLocale) {
  if (_i18n.global.locale === newLocale) {
    return
  }

  _i18n.global.locale = newLocale
}

async function loadMessagesFor(locale) {
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../translations/${locale}.json`
  )

  _i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export default {
  get instance() {
    return _i18n
  },
  setup,
  setLocale,
  loadMessagesFor,
}

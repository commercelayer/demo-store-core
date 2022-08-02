import { defaultLanguage } from '#config/general.config'
import type { Locale, NonShoppableLocale, ShoppableLocale } from '#i18n/locale'
import type { LocalizedField, RawDataCountry, RawDataLanguage } from '@commercelayer/demo-store-types'
import { combine } from './collection'
import { isCountryShoppable } from './countries'

export function makeLocaleCode(languageCode: string, countryCode?: string): string {
  if (countryCode) {
    return `${languageCode}-${countryCode}`
  }

  return languageCode
}

const localesRegExp = /^([A-Za-z]{2,4})(?:-([A-Za-z]{4}))?(?:-([A-Za-z]{2}|[0-9]{3}))?$/

export function parseLocaleCode(localeCode: string) {
  const [_locale, languageCode, scriptCode, countryCode] = localeCode.match(localesRegExp) || [] as (string | undefined)[]
  return { languageCode, scriptCode, countryCode }
}

export function changeLanguage(localeCode: string, newLanguageCode: string) {
  const { countryCode } = parseLocaleCode(localeCode)
  return makeLocaleCode(newLanguageCode, countryCode)
}

export function makeLocales(languages: RawDataLanguage[], countries: RawDataCountry[]): Locale[] {
  return combine(countries, languages, (country, language) => {
    const code = makeLocaleCode(language.code, country.code)

    if (isCountryShoppable(country)) {
      const locale: ShoppableLocale = { code, language, isShoppable: true, country }
      return locale
    }

    const locale: NonShoppableLocale = { code, language, isShoppable: false, country }
    return locale
  })
    .concat(languages.map(language => {
      const locale: NonShoppableLocale = {
        code: language.code,
        isShoppable: false,
        language
      }

      return locale
    }))
}

export function translateField<T>(field: LocalizedField<T>, locale: string): T {
  const { languageCode = locale } = parseLocaleCode(locale)

  const translation = field[locale] || field[languageCode] || field[defaultLanguage]

  if (!translation) {
    throw new Error(`Missing translation for locale '${locale}' : ${JSON.stringify(field)}`)
  }

  return translation
}

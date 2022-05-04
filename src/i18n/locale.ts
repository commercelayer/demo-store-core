import { countries, Country } from '#data/countries'
import { languages, Language } from '#data/languages'

import { combine } from './utils'

export type Locale = {
  code: string
  country?: Country
  language: Language
}

const languageCodes = languages.map(language => language.code)
const countryCodes = countries.map(country => country.code)
const localesRegExp = new RegExp(`^(${languageCodes.join('|')})(?:-(${countryCodes.join('|')}))?$`)

export function makeLocaleCode(languageCode: string, countryCode?: string): string {
  if (countryCode) {
    return `${languageCode}-${countryCode}`
  }

  return languageCode
}

export function parseLocaleCode(localeCode: string) {
  const [_locale, languageCode, countryCode] = localeCode.match(localesRegExp) || [] as (string | undefined)[]
  return { languageCode, countryCode }
}

export function changeLanguage(localeCode: string, newLanguageCode: string) {
  const { countryCode } = parseLocaleCode(localeCode)
  return makeLocaleCode(newLanguageCode, countryCode)
}

export function makeLocales(languages: Language[], countries: Country[]): Locale[] {
  return combine(countries, languages, (country, language) => {
    const locale: Locale = {
      code: makeLocaleCode(language.code, country.code),
      country,
      language
    }

    return locale
  })
    .concat(languages.map(language => ({
      code: language.code,
      language
    })))
}

export const locales = makeLocales(languages, countries)

export const getLocale = (localeCode: string) => locales.find(locale => locale.code === localeCode)

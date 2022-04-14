import { countries, Country } from '#data/countries'
import { languages, Language } from '#data/languages'

import { combine } from './utils'

export type Locale = {
  code: string
  country?: Country
  language: Language
}

export function makeLocaleCode(countryCode: string, languageCode: string): string {
  return `${languageCode.toLowerCase()}-${countryCode.toLowerCase()}`
}

export function makeLocales(countries: Country[], languages: Language[]): Locale[] {
  return combine(countries, languages, (country, language) => {
    const locale: Locale = {
      code: makeLocaleCode(country.code, language.code),
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

export const locales = makeLocales(countries, languages)

export const getLocale = (localeCode: string) => locales.find(locale => locale.code === localeCode)

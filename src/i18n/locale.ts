import { rawDataCountries, RawDataCountry } from '#data/countries'
import { RawDataLanguage, rawDataLanguages } from '#data/languages'
import { combine } from '#utils/collection'
import { z } from 'zod'

type BaseLocale = {
  code: string
  language: RawDataLanguage
}

export type NonShoppableLocale = BaseLocale & {
  isShoppable: false
}

export type ShoppableLocale = BaseLocale & {
  isShoppable: true
  country: RawDataCountry
}

export type Locale = ShoppableLocale | NonShoppableLocale

const languageCodes = rawDataLanguages.map(language => language.code)
const countryCodes = rawDataCountries.map(country => country.code)
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

export function makeLocales(languages: RawDataLanguage[], countries: RawDataCountry[]): Locale[] {
  return combine(countries, languages, (country, language) => {
    const locale: Locale = {
      code: makeLocaleCode(language.code, country.code),
      isShoppable: typeof country !== 'undefined',
      country,
      language
    }

    return locale
  })
    .concat(languages.map(language => ({
      code: language.code,
      isShoppable: false,
      language
    })))
}

export const locales = makeLocales(rawDataLanguages, rawDataCountries)
export const localeCodes = combine(languageCodes, countryCodes, makeLocaleCode).concat(languageCodes)

export const [ defaultLocale ] = languageCodes

export function getLocale(localeCode: string): Locale
export function getLocale(localeCode: string, throwWhenUndefined: false): Locale | undefined
export function getLocale(localeCode: string, throwWhenUndefined = true) {
  const locale = locales.find(locale => locale.code === localeCode)

  if (throwWhenUndefined && !locale) {
    throw new Error(`Cannot find a locale with code "${localeCode}"`)
  }

  return locale
}


export const localizedFieldSchema = <T extends z.ZodTypeAny>(type: T) => z
  .object({
    ...localeCodes.reduce((acc, localeCode) => {
      acc[localeCode] = type.optional()
      return acc
    }, {} as { [localeCode: string]: T | z.ZodOptional<T> }),
    [defaultLocale]: type,
  })


export type LocalizedField<T> = {
  [localeCode: string]: T | undefined
}

export function translateField<T>(field: LocalizedField<T>, locale: string): T {
  const { languageCode = locale } = parseLocaleCode(locale)

  const translation = field[locale] || field[languageCode] || field[defaultLocale]

  if (!translation) {
    throw new Error(`Missing translation for locale '${locale}' : ${JSON.stringify(field)}`)
  }

  return translation
}
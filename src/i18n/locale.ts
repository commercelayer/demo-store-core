import { rawDataCountries } from '#data/countries'
import { RawDataLanguage, rawDataLanguages } from '#data/languages'
import type { NonShoppableCountry, ShoppableCountry } from '#utils/countries'
import { makeLocales } from '#utils/locale'

type BaseLocale = {
  code: string
  language: RawDataLanguage
}

export type NonShoppableLocale = BaseLocale & {
  isShoppable: false
  country?: NonShoppableCountry
}

export type ShoppableLocale = BaseLocale & {
  isShoppable: true
  country: ShoppableCountry
}

export type Locale = ShoppableLocale | NonShoppableLocale

export const locales = makeLocales(rawDataLanguages, rawDataCountries)

export function getLocale(localeCode: string): Locale
export function getLocale(localeCode: string, throwWhenUndefined: false): Locale | undefined
export function getLocale(localeCode: string, throwWhenUndefined = true) {
  const locale = locales.find(locale => locale.code === localeCode)

  if (throwWhenUndefined && !locale) {
    throw new Error(`Cannot find a locale with code "${localeCode}"`)
  }

  return locale
}

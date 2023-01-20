import { getRawDataCountries } from '#data/countries'
import { getRawDataLanguages } from '#data/languages'
import type { NonShoppableCountry, ShoppableCountry } from '#utils/countries'
import { makeLocales } from '#utils/locale'
import { memoize } from '#utils/memoize'
import type { RawDataLanguage } from '@commercelayer/demo-store-types'

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

export const getLocales = memoize(
  async function () {
    const languages = await getRawDataLanguages()
    const countries = await getRawDataCountries()
    return makeLocales(languages, countries)
  }
)

export const getLocaleCodes = memoize(
  async function () {
    return await (await getLocales()).map(locale => locale.code)
  }
)

export const getShoppableLocales = memoize(
  async function () {
    const locales = await getLocales()
    return locales.filter(locale => locale.isShoppable)
  }
)

export async function getLocale(localeCode: string): Promise<Locale>
export async function getLocale(localeCode: string) {
  const locales = await getLocales()

  const locale = locales.find(locale => locale.code === localeCode)

  if (!locale) {
    throw new Error(`Cannot find a locale with code "${localeCode}"`)
  }

  return locale
}

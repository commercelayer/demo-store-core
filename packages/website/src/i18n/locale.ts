import { getRawDataCountries } from '#data/countries'
import { getRawDataLanguages } from '#data/languages'
import type { NonShoppableCountry, ShoppableCountry } from '#utils/countries'
import { makeLocales } from '#utils/locale'
import type { RawDataLanguage } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

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

export async function getLocale(localeCode: string): Promise<Locale>
export async function getLocale(localeCode: string) {
  const locales = await getLocales()

  const locale = locales.find(locale => locale.code === localeCode)

  if (!locale) {
    throw new Error(`Cannot find a locale with code "${localeCode}"`)
  }

  return locale
}

import { NEXT_PUBLIC_DEFAULT_LANGUAGE } from '#utils/envs'
import type { Locale, NonShoppableLocale, ShoppableLocale } from '#i18n/locale'
import type { LocalizedField, RawDataCountry, RawDataLanguage } from '@commercelayer/demo-store-types'
import { isCountryShoppable } from './countries'
import { isNotNullish, PickByValueExact } from './utility-types'

export function makeLocaleCode(languageCode: string, countryCode?: string): string {
  if (countryCode) {
    return `${languageCode}-${countryCode}`
  }

  return languageCode
}

const localesRegExpAsString = '([A-Za-z]{2,4})(?:-([A-Za-z]{4}))?(?:-([A-Za-z]{2}|[0-9]{3}))?'
const localesRegExp = new RegExp(`^${localesRegExpAsString}$`)

export function parseLocaleCode(localeCode: string) {
  const [_locale, languageCode, scriptCode, countryCode] = localeCode.match(localesRegExp) || [] as (string | undefined)[]
  return { languageCode, scriptCode, countryCode }
}

export function changeLanguage(localeCode: string, newLanguageCode: string) {
  const { countryCode } = parseLocaleCode(localeCode)
  return makeLocaleCode(newLanguageCode, countryCode)
}

export function switchLocale(asPath: string, newLocaleCode: string): string {
  return asPath.replace(new RegExp(`/${localesRegExpAsString}/`), `/${newLocaleCode}/`)
}

export function makeLocales(languages: RawDataLanguage[], countries: RawDataCountry[]): Locale[] {
  const countryLocales = countries.flatMap(
    (country) => country.languages.map(
      (languageCode) => {
        const language = languages.find(lang => lang.code === languageCode)

        if (language === undefined) {
          console.warn(`Cannot find the language code "${languageCode}" for the country "${country.name}"`)
          return
        }

        const code = makeLocaleCode(language.code, country.code)

        if (isCountryShoppable(country)) {
          const locale: ShoppableLocale = { code, language, isShoppable: true, country }
          return locale
        }

        const locale: NonShoppableLocale = { code, language, isShoppable: false, country }
        return locale
      }
    ).filter(isNotNullish)
  )

  return countryLocales
    .concat(languages.map(language => ({
      code: language.code,
      isShoppable: false,
      language
    }) satisfies NonShoppableLocale))
}

export function translateField<
  Item extends { [key in Attribute]: LocalizedField<Translation> },
  Attribute extends keyof PickByValueExact<Item, LocalizedField<any>>,
  Translation = Item[Attribute][string]
>(
  item: Item,
  attribute: Attribute,
  locale: string
): Translation {
  const { languageCode = locale } = parseLocaleCode(locale)

  const field = item[attribute]
  const translation = field[locale] || field[languageCode] || field[NEXT_PUBLIC_DEFAULT_LANGUAGE]

  if (!translation) {
    throw new Error(
      [
        `Missing translation for attribute "${attribute.toString()}".`,
        `Locale: "${locale}"`,
        `Language: "${languageCode}"`,
        `Default: "${NEXT_PUBLIC_DEFAULT_LANGUAGE}"`,
        '',
        JSON.stringify(item, undefined, 2)
      ].join('\n')
    )
  }

  return translation
}

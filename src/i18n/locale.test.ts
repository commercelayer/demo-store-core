import { Country } from '#data/countries'
import { Language } from '#data/languages'

import { getLocale, Locale, makeLocaleCode, makeLocales } from './locale'

describe('makeLocaleCode', () => {
  it('creates a localeCode given a countryCode and a languageCode', () => {
    expect(makeLocaleCode('us', 'it')).toStrictEqual('it-us')
    expect(makeLocaleCode('UK', 'en')).toStrictEqual('en-uk')
    expect(makeLocaleCode('it', 'IT')).toStrictEqual('it-it')
    expect(makeLocaleCode('BE', 'FR')).toStrictEqual('fr-be')
  })
})

describe('makeLocales', () => {
  it('should create locales from a list of countries and languages', () => {
    const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States', region: 'Americas' }
    const italy: Country = { code: 'IT', default_language: 'it', market: 401, name: 'Italy', region: 'Europe' }
    const italian: Language = { code: 'it', name: 'Italiano' }
    const english: Language = { code: 'en', name: 'English' }

    const actual = makeLocales([unitedStates, italy], [italian, english])

    const expects: Locale[] = [
      { "code": "it-us", "country": unitedStates, "language": italian },
      { "code": "en-us", "country": unitedStates, "language": english },
      { "code": "it-it", "country": italy, "language": italian },
      { "code": "en-it", "country": italy, "language": english },
      { "code": "it", "language": italian },
      { "code": "en", "language": english }
    ]

    expect(actual).toStrictEqual(expects)
  })
})

describe('getLocale', () => {
  it('should be able to return a Locale gived a localeCode', () => {
    const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States', region: 'Americas' }
    const italian: Language = { code: 'it', name: 'Italiano' }

    const locale: Locale | undefined = getLocale('it-us')

    expect(locale).toStrictEqual<Locale>({
      code: 'it-us',
      country: unitedStates,
      language: italian
    })
  })

  it('should return undefined when the localeCode is unknown', () => {
    const locale: Locale | undefined = getLocale('aa-bb')
    expect(locale).toBe(undefined)
  })
})

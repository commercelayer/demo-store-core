import { Country } from '#data/countries'
import { Language } from '#data/languages'

import { getLocale, Locale, makeLocaleCode, makeLocales, parseLocaleCode } from './locale'

describe('makeLocaleCode', () => {
  it('creates a localeCode given a countryCode and a languageCode', () => {
    expect(makeLocaleCode('it', 'us')).toStrictEqual('it-us')
    expect(makeLocaleCode('en', 'UK')).toStrictEqual('en-UK')
    expect(makeLocaleCode('IT', 'it')).toStrictEqual('IT-it')
    expect(makeLocaleCode('FR', 'BE')).toStrictEqual('FR-BE')
    expect(makeLocaleCode('en')).toStrictEqual('en')
  })
})

describe('makeLocales', () => {
  it('should create locales from a list of countries and languages', () => {
    const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italy: Country = { code: 'IT', default_language: 'it', market: 401, name: 'Italy', region: 'Europe', catalog: 'EMEA' }
    const italian: Language = { code: 'it', name: 'Italiano', catalog: 'AMER' }
    const english: Language = { code: 'en', name: 'English', catalog: 'AMER' }

    const actual = makeLocales([italian, english], [unitedStates, italy])

    const expects: Locale[] = [
      { "code": "it-US", "country": unitedStates, "language": italian },
      { "code": "en-US", "country": unitedStates, "language": english },
      { "code": "it-IT", "country": italy, "language": italian },
      { "code": "en-IT", "country": italy, "language": english },
      { "code": "it", "language": italian },
      { "code": "en", "language": english }
    ]

    expect(actual).toStrictEqual(expects)
  })
})

describe('parseLocale', () => {
  it('should extract the "language" and "country" from a locale', () => {
    expect(parseLocaleCode('en-US')).toEqual({ languageCode: 'en', countryCode: 'US' })
    expect(parseLocaleCode('xx-US')).toEqual({ languageCode: undefined, countryCode: undefined })
    expect(parseLocaleCode('en')).toEqual({ languageCode: 'en', countryCode: undefined })
  })
})


describe('getLocale', () => {
  it('should be able to return a Locale gived a localeCode', () => {
    const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italian: Language = { code: 'it', name: 'Italiano', catalog: 'AMER' }

    const locale = getLocale('it-US')

    expect(locale).toStrictEqual<Locale>({
      code: 'it-US',
      country: unitedStates,
      language: italian
    })
  })

  it('should return undefined when the localeCode is unknown', () => {
    expect(() => getLocale('aa-BB')).toThrowError(new Error('Cannot find a locale with code "aa-BB"'))
  })

  it('should return undefined when the localeCode is unknown and throw option is set to false', () => {
    const locale = getLocale('aa-BB', false)
    expect(locale).toBe(undefined)
  })
})

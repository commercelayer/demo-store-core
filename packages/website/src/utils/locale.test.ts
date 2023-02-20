import type { Locale } from '#i18n/locale'
import type { NonShoppableCountry, ShoppableCountry } from '#utils/countries'
import type { LocalizedField, RawDataLanguage } from '@commercelayer/demo-store-types'
import { changeLanguage, makeLocaleCode, makeLocales, parseLocaleCode, translateField } from './locale'


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
    const unitedStates: ShoppableCountry = { code: 'US', languages: ['en'], market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italy: ShoppableCountry = { code: 'IT', languages: ['it', 'en'], market: 10427, name: 'Italy', region: 'Europe', catalog: 'EMEA' }
    const italian: RawDataLanguage = { code: 'it', name: 'ITA', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([italian, english], [unitedStates, italy])

    const expects: Locale[] = [
      { code: "en-US", isShoppable: true, country: unitedStates, language: english },
      { code: "it-IT", isShoppable: true, country: italy, language: italian },
      { code: "en-IT", isShoppable: true, country: italy, language: english },
      { code: "it", isShoppable: false, language: italian },
      { code: "en", isShoppable: false, language: english }
    ]

    expect(actual).toStrictEqual(expects)
  })
})

describe('parseLocale', () => {
  it('should extract the "language" and "country" from a locale', () => {
    expect(parseLocaleCode('en-US')).toEqual({languageCode: 'en', scriptCode: undefined, countryCode: 'US' })
    expect(parseLocaleCode('xx-US')).toEqual({ languageCode: 'xx', scriptCode: undefined, countryCode: 'US' })
    expect(parseLocaleCode('en')).toEqual({ languageCode: 'en', scriptCode: undefined, countryCode: undefined })

    expect(parseLocaleCode('mn')).toEqual({ languageCode: 'mn', scriptCode: undefined, countryCode: undefined })
    expect(parseLocaleCode('mn-Cyrl')).toEqual({ languageCode: 'mn', scriptCode: 'Cyrl', countryCode: undefined })
    expect(parseLocaleCode('mn-MN')).toEqual({ languageCode: 'mn', scriptCode: undefined, countryCode: 'MN' })
    expect(parseLocaleCode('mn-Mong')).toEqual({ languageCode: 'mn', scriptCode: 'Mong', countryCode: undefined })
    expect(parseLocaleCode('mn-Mong-CN')).toEqual({ languageCode: 'mn', scriptCode: 'Mong', countryCode: 'CN' })
  })
})

describe('translateField', () => {
  it('should returns the localized field by provided locale (language)', () => {
    const item: { text: string; localizedField: LocalizedField<string> } = {
      text: 'string',
      localizedField: {
        en: 'English title',
        it: 'Titolo italiano',
        'en-US': 'American title'
      }
    }

    const value = translateField(item, 'localizedField', 'en')
    expect(value).toStrictEqual('English title')
  })

  it('should returns the localized field by provided locale (language + country)', () => {
    const item: { text: string; localizedField: LocalizedField<string> } = {
      text: 'string',
      localizedField: {
        en: 'English title',
        it: 'Titolo italiano',
        'en-US': 'American title'
      }
    }

    const value = translateField(item, 'localizedField', 'en-US')
    expect(value).toStrictEqual('American title')
  })

  it('should fallback to language when provided language-COUNTRY is not found', () => {
    const item: { text: string; localizedField: LocalizedField<string> } = {
      text: 'string',
      localizedField: {
        en: 'English title',
        it: 'Titolo italiano',
        'en-US': 'American title'
      }
    }

    const value = translateField(item, 'localizedField', 'it-CN')
    expect(value).toStrictEqual('Titolo italiano')
  })

  it('should throw an error when locale and language are not found and also default locale is not available', () => {
    const item: { text: string; localizedField: LocalizedField<string> } = {
      text: 'string',
      localizedField: {
        it: 'Titolo italiano',
        'en-US': 'American title'
      }
    }

    expect(() => translateField(item, 'localizedField', 'fr-CN')).toThrowError(
      [
        `Missing translation for attribute "localizedField".`,
        `Locale: "fr-CN"`,
        `Language: "fr"`,
        `Default: "en"`,
        '',
        JSON.stringify(item, undefined, 2)
      ].join('\n')
    )
  })
})

describe('changeLanguage', () => {
  it('should do nothing given the same language', () => {
    expect(changeLanguage('en', 'en')).toStrictEqual('en')
    expect(changeLanguage('en-US', 'en')).toStrictEqual('en-US')
  })

  it('should change language given another language', () => {
    expect(changeLanguage('en', 'it')).toStrictEqual('it')
    expect(changeLanguage('en-US', 'it')).toStrictEqual('it-US')
  })
})

describe('Locale.isShoppable property', () => {
  it('should be false when country is not defined', () => {
    const unitedStates: ShoppableCountry = { code: 'US', languages: ['en'], market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([english], [unitedStates])

    const expects: Locale[] = [
      { code: "en-US", isShoppable: true, country: unitedStates, language: english },
      { code: "en", isShoppable: false, language: english }
    ]

    expect(actual).toStrictEqual(expects)
  })

  it('should be false when country doesn\'t have the market property', () => {
    const unitedStates: NonShoppableCountry = { code: 'US', languages: ['en'], name: 'United States', region: 'Americas', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([english], [unitedStates])

    const expects: Locale[] = [
      { code: "en-US", isShoppable: false, country: unitedStates, language: english },
      { code: "en", isShoppable: false, language: english }
    ]

    expect(actual).toStrictEqual(expects)
  })
})
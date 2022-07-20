import type { RawDataLanguage } from '#data/languages'
import type { NonShoppableCountry, ShoppableCountry } from '#utils/countries'
import { changeLanguage, getLocale, Locale, makeLocaleCode, makeLocales, parseLocaleCode, translateField } from './locale'


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
    const unitedStates: ShoppableCountry = { code: 'US', default_language: 'en', market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italy: ShoppableCountry = { code: 'IT', default_language: 'it', market: 10427, name: 'Italy', region: 'Europe', catalog: 'EMEA' }
    const italian: RawDataLanguage = { code: 'it', name: 'ITA', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([italian, english], [unitedStates, italy])

    const expects: Locale[] = [
      { code: "it-US", isShoppable: true, country: unitedStates, language: italian },
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
    expect(parseLocaleCode('en-US')).toEqual({ languageCode: 'en', countryCode: 'US' })
    expect(parseLocaleCode('xx-US')).toEqual({ languageCode: undefined, countryCode: undefined })
    expect(parseLocaleCode('en')).toEqual({ languageCode: 'en', countryCode: undefined })
  })
})


describe('getLocale', () => {
  it('should be able to return a Locale gived a localeCode', () => {
    const unitedStates: ShoppableCountry = { code: 'US', default_language: 'en', market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italian: RawDataLanguage = { code: 'it', name: 'Italiano', catalog: 'AMER' }

    const locale = getLocale('it-US')

    expect(locale).toStrictEqual<Locale>({
      code: 'it-US',
      country: unitedStates,
      language: italian,
      isShoppable: true
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

describe('translateField', () => {
  it('should returns the localized field by provided locale (language)', () => {
    const value = translateField({
      en: 'English title',
      it: 'Titolo italiano',
      'en-US': 'American title'
    }, 'en')
    expect(value).toStrictEqual('English title')
  })

  it('should returns the localized field by provided locale (language + country)', () => {
    const value = translateField({
      en: 'English title',
      it: 'Titolo italiano',
      'en-US': 'American title'
    }, 'en-US')
    expect(value).toStrictEqual('American title')
  })

  it('should fallback to language when provided language-COUNTRY is not found', () => {
    const value = translateField({
      en: 'English title',
      it: 'Titolo italiano',
      'en-US': 'American title'
    }, 'it-CN')
    expect(value).toStrictEqual('Titolo italiano')
  })

  it('should fallback to default locale when locale and language are not found', () => {
    const value = translateField({
      fr: 'titre français',
      en: 'English title',
      it: 'Titolo italiano',
      'en-US': 'American title'
    }, 'fr-CN')
    expect(value).toStrictEqual('English title')
  })

  it('should throw an error when locale and language are not found and also default locale is not available', () => {
    expect(() => translateField({
      fr: 'titre français',
      it: 'Titolo italiano',
      'en-US': 'American title'
    }, 'fr-CN')).toThrowError(`Missing translation for locale 'fr-CN' : {"fr":"titre français","it":"Titolo italiano","en-US":"American title"}`)
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
    const unitedStates: ShoppableCountry = { code: 'US', default_language: 'en', market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([english], [unitedStates])

    const expects: Locale[] = [
      { code: "en-US", isShoppable: true, country: unitedStates, language: english },
      { code: "en", isShoppable: false, language: english }
    ]

    expect(actual).toStrictEqual(expects)
  })

  it('should be false when country doesn\'t have the market property', () => {
    const unitedStates: NonShoppableCountry = { code: 'US', default_language: 'en', name: 'United States', region: 'Americas', catalog: 'AMER' }
    const english: RawDataLanguage = { code: 'en', name: 'ENG', catalog: 'AMER' }

    const actual = makeLocales([english], [unitedStates])

    const expects: Locale[] = [
      { code: "en-US", isShoppable: false, country: unitedStates, language: english },
      { code: "en", isShoppable: false, language: english }
    ]

    expect(actual).toStrictEqual(expects)
  })
})
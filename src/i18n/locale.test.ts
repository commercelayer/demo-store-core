import type { RawDataLanguage } from '#data/languages'
import type { ShoppableCountry } from '#utils/countries'
import { getLocale, Locale } from './locale'

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

import type { RawDataLanguage } from '#data/languages'
import type { ShoppableCountry } from '#utils/countries'
import { getLocale, Locale } from './locale'

describe('getLocale', () => {
  it('should be able to return a Locale gived a localeCode', async () => {
    const unitedStates: ShoppableCountry = { code: 'US', default_language: 'en', market: 10426, name: 'United States', region: 'Americas', catalog: 'AMER' }
    const italian: RawDataLanguage = { code: 'it', name: 'Italiano', catalog: 'AMER' }

    const locale = await getLocale('it-US')

    expect(locale).toStrictEqual<Locale>({
      code: 'it-US',
      country: unitedStates,
      language: italian,
      isShoppable: true
    })
  })

  it('should return undefined when the localeCode is unknown', async () => {
    expect(getLocale('aa-BB')).rejects.toThrowError(new Error('Cannot find a locale with code "aa-BB"'))
  })

  it('should return undefined when the localeCode is unknown and throw option is set to false', async () => {
    const locale = await getLocale('aa-BB', false)
    expect(locale).toBe(undefined)
  })
})

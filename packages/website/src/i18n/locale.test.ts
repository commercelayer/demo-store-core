import type { ShoppableCountry } from '#utils/countries'
import type { RawDataLanguage } from '@commercelayer/demo-store-types'
import { getLocale, Locale } from './locale'

const unitedStates: ShoppableCountry = { code: 'US', languages: ['en', 'it'], market: 11279, name: 'United States', region: 'Americas', catalog: 'AMER' }
const italian: RawDataLanguage = { code: 'it', name: 'Italiano', catalog: 'AMER' }
const english: RawDataLanguage = { code: 'en', name: 'English', catalog: 'AMER' }

jest.mock('#data/countries', () => ({
  getRawDataCountries: () => ([unitedStates])
}))

jest.mock('#data/languages', () => ({
  getRawDataLanguages: () => ([italian, english])
}))

describe('getLocale', () => {
  it('should be able to return a Locale given a localeCode', async () => {
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

  // it('should return undefined when the localeCode is unknown and throw option is set to false', async () => {
  //   const locale = await getLocale('aa-BB', false)
  //   expect(locale).toBe(undefined)
  // })
})

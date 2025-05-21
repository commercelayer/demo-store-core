import type { RawDataCountry } from '@commercelayer/demo-store-types'
import { type CountriesByRegion, groupByRegion } from './countries'

test('should be able to group locales by their region', () => {
  const italy: RawDataCountry = { code: 'IT', languages: ['it'], market: 'code:eu', name: 'Italy', region: 'Europe', catalog: 'AMER' }
  const unitedStates: RawDataCountry = { code: 'US', languages: ['en'], market: 'code:us', name: 'United States', region: 'Americas', catalog: 'AMER' }
  const singapore: RawDataCountry = { code: 'SG', languages: ['en'], market: 'code:us', name: 'Singapore', region: 'Asia', catalog: 'AMER' }
  const canada: RawDataCountry = { code: 'CA', languages: ['en'], market: 'code:us', name: 'Canada', region: 'Americas', catalog: 'AMER' }

  const actual = groupByRegion([italy, unitedStates, singapore, canada])

  const expects: CountriesByRegion = {
    'Americas': [unitedStates, canada],
    'Asia': [singapore],
    'Europe': [italy],
  }

  expect(actual).toStrictEqual(expects)
})

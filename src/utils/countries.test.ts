import type { Country } from '#data/countries'
import { CountriesByRegion, groupByRegion } from './countries'

test('should be able to group locales by their region', () => {
  const italy: Country = { code: 'IT', default_language: 'it', market: 401, name: 'Italy', region: 'Europe', catalog: 'AMER' }
  const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States', region: 'Americas', catalog: 'AMER' }
  const singapore: Country = { code: 'SG', default_language: 'en', market: 400, name: 'Singapore', region: 'Asia', catalog: 'AMER' }
  const canada: Country = { code: 'CA', default_language: 'en', market: 400, name: 'Canada', region: 'Americas', catalog: 'AMER' }

  const actual = groupByRegion([italy, unitedStates, singapore, canada])

  const expects: CountriesByRegion = {
    'Americas': [unitedStates, canada],
    'Asia': [singapore],
    'Europe': [italy],
  }

  expect(actual).toStrictEqual(expects)
})

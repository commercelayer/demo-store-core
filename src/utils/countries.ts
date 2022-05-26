import type { RawDataCountry } from '#data/countries'

export type CountriesByRegion = {
  [region: RawDataCountry['region']]: RawDataCountry[]
}

export const groupByRegion = (countries: RawDataCountry[]): CountriesByRegion => {
  return countries.reduce((countriesByRegion, country) => {
    return {
      ...countriesByRegion,
      [country.region]: [
        ...(countriesByRegion[country.region] || []),
        country
      ]
    }
  }, {} as CountriesByRegion)
}

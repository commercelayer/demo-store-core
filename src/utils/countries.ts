import type { Country } from '#data/countries'

export type CountriesByRegion = {
  [region: Country['region']]: Country[]
}

export const groupByRegion = (countries: Country[]): CountriesByRegion => {
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

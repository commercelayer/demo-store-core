import countriesJson from './json/countries.json'

export type Country = {
  name: string;
  code: string;
  market: number;
  default_language: string;
  region: string;
}

export type CountriesByRegion = {
  [region: Country['region']]: Country[]
}

export const countries: Country[] = countriesJson

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
import countriesJson from './json/countries.json'

export type RawDataCountry = {
  name: string;
  code: string;
  market: number;
  catalog: string;
  default_language: string;
  region: string;
}

export const rawDataCountries: RawDataCountry[] = countriesJson

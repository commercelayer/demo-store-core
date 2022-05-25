import countriesJson from './json/countries.json'

export type Country = {
  name: string;
  code: string;
  market: number;
  catalog: string;
  default_language: string;
  region: string;
}

export const rawDataCountries: Country[] = countriesJson

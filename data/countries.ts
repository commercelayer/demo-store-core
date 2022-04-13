import countriesJson from './json/countries.json'

export type Country = {
  name: string;
  code: string;
  market: number;
  default_language: string;
}

export const countries: Country[] = countriesJson

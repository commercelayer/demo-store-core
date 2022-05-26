import languagesJson from './json/languages.json'

export type RawDataLanguage = {
  name: string;
  code: string;
  catalog: string;
}

export const rawDataLanguages: RawDataLanguage[] = languagesJson

import languagesJson from './json/languages.json'

export type Language = {
  name: string;
  code: string;
  catalog: string;
}

export const rawDataLanguages: Language[] = languagesJson

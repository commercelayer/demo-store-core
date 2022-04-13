import languagesJson from './json/languages.json'

export type Language = {
  name: string;
  code: string;
}

export const languages: Language[] = languagesJson

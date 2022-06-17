import { z } from 'zod'
import languagesJson from './json/languages.json'

const languageSchema = z.object({
  name: z.string(),
  code: z.string(),
  catalog: z.string()
})

export type RawDataLanguage = z.infer<typeof languageSchema>

export const rawDataLanguages = languageSchema.array().parse(languagesJson);

// Type Check
(_: RawDataLanguage[] = languagesJson) => { }

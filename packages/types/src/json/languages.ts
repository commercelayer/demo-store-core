import { z } from 'zod'

const language_schema = z.object({
  name: z.string(),
  code: z.string(),
  catalog: z.string()
})

export const rawDataLanguages_schema = language_schema.array()

export type RawDataLanguage = z.infer<typeof language_schema>

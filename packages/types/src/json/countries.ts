import { z } from 'zod'

const country_schema = z.object({
  name: z.string(),
  code: z.string(),
  market: z.number().optional(),
  catalog: z.string(),
  default_language: z.string(),
  region: z.string()
})

export const rawDataCountries_schema = country_schema.array()

export type RawDataCountry = z.infer<typeof country_schema>

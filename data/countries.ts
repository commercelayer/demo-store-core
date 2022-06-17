import { z } from 'zod'
import countriesJson from './json/countries.json'

const countrySchema = z.object({
  name: z.string(),
  code: z.string(),
  market: z.number(),
  catalog: z.string(),
  default_language: z.string(),
  region: z.string()
})

export type RawDataCountry = z.infer<typeof countrySchema>

export const rawDataCountries = countrySchema.array().parse(countriesJson);

// Type Check
(_: RawDataCountry[] = countriesJson) => { }

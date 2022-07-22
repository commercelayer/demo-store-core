import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataCountries = memoize(
  async function (): Promise<RawDataCountry[]> {
    const dataFolder = './json'
    const jsonData = (await import(`${dataFolder}/countries.json`)).default
    // const jsonData = await fetch('http://localhost:3001/json/countries.json').then(response => response.json())

    return countrySchema.array().parse(jsonData)
  }
)


const countrySchema = z.object({
  name: z.string(),
  code: z.string(),
  market: z.number().optional(),
  catalog: z.string(),
  default_language: z.string(),
  region: z.string()
})

export type RawDataCountry = z.infer<typeof countrySchema>

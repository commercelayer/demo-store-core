import { fetchData } from '#utils/data'
import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataCountries = memoize(
  async function (): Promise<RawDataCountry[]> {
    return countrySchema.array().parse(
      await fetchData('countries')
    )
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

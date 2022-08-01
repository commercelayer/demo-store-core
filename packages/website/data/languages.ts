import { fetchData } from '#utils/data'
import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataLanguages = memoize(
  async function (): Promise<RawDataLanguage[]> {
    return languageSchema.array().parse(
      await fetchData('languages')
    )
  }
)


const languageSchema = z.object({
  name: z.string(),
  code: z.string(),
  catalog: z.string()
})

export type RawDataLanguage = z.infer<typeof languageSchema>

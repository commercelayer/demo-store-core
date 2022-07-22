import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataLanguages = memoize(
  async function (): Promise<RawDataLanguage[]> {
    const dataFolder = './json'
    const jsonData = (await import(`${dataFolder}/languages.json`)).default
    // const jsonData = await fetch('http://localhost:3001/json/languages.json').then(response => response.json())

    return languageSchema.array().parse(jsonData)
  }
)


const languageSchema = z.object({
  name: z.string(),
  code: z.string(),
  catalog: z.string()
})

export type RawDataLanguage = z.infer<typeof languageSchema>

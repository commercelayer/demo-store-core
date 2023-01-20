import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { RawDataLanguage, rawDataLanguages_schema } from '@commercelayer/demo-store-types'

export const getRawDataLanguages = memoize(
  async function (): Promise<RawDataLanguage[]> {
    return rawDataLanguages_schema.parse(
      await fetchJsonData('languages')
    )
  }
)

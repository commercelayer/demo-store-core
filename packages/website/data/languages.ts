import { fetchData } from '#utils/data'
import { RawDataLanguage, rawDataLanguages_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataLanguages = memoize(
  async function (): Promise<RawDataLanguage[]> {
    return rawDataLanguages_schema.parse(
      await fetchData('languages')
    )
  }
)

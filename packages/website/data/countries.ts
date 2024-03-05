import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { rawDataCountries_schema, type RawDataCountry } from '@commercelayer/demo-store-types'

export const getRawDataCountries = memoize(
  async function (): Promise<RawDataCountry[]> {
    return rawDataCountries_schema.parse(
      await fetchJsonData('countries')
    )
  }
)

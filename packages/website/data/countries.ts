import { fetchData } from '#utils/data'
import { rawDataCountries_schema, RawDataCountry } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataCountries = memoize(
  async function (): Promise<RawDataCountry[]> {
    return rawDataCountries_schema.parse(
      await fetchData('countries')
    )
  }
)

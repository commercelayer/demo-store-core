import { fetchJsonData } from '#utils/data'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { RawDataCatalog, rawDataCatalogs_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataCatalogs = memoize(
  async function (): Promise<Unserializable<RawDataCatalog[]>> {
    return makeUnserializable(
      rawDataCatalogs_schema.parse(
        await fetchJsonData('catalogs')
      )
    )
  }
)

import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { makeUnserializable, type Unserializable } from '#utils/unserializable'
import { type RawDataCatalog, rawDataCatalogs_schema } from '@commercelayer/demo-store-types'

export const getRawDataCatalogs = memoize(
  async function (): Promise<Unserializable<RawDataCatalog[]>> {
    return makeUnserializable(
      rawDataCatalogs_schema.parse(
        await fetchJsonData('catalogs')
      )
    )
  }
)

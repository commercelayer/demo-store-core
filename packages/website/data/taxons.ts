import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { makeUnserializable, type Unserializable } from '#utils/unserializable'
import { type RawDataTaxon, rawDataTaxons_schema } from '@commercelayer/demo-store-types'

export const getRawDataTaxons = memoize(
  async function (): Promise<Unserializable<RawDataTaxon[]>> {
    return makeUnserializable(
      rawDataTaxons_schema.parse(
        await fetchJsonData('taxons')
      )
    )
  }
)

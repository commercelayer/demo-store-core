import { fetchJsonData } from '#utils/data'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { RawDataTaxon, rawDataTaxons_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataTaxons = memoize(
  async function (): Promise<Unserializable<RawDataTaxon[]>> {
    return makeUnserializable(
      rawDataTaxons_schema.parse(
        await fetchJsonData('taxons')
      )
    )
  }
)

import { fetchJsonData } from '#utils/data'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { rawDataTaxonomies_schema, RawDataTaxonomy } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataTaxonomies = memoize(
  async function (): Promise<Unserializable<RawDataTaxonomy[]>> {
    return makeUnserializable(
      rawDataTaxonomies_schema.parse(
        await fetchJsonData('taxonomies')
      )
    )
  }
)

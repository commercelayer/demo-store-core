import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { rawDataTaxonomies_schema, RawDataTaxonomy } from '@commercelayer/demo-store-types'

export const getRawDataTaxonomies = memoize(
  async function (): Promise<Unserializable<RawDataTaxonomy[]>> {
    return makeUnserializable(
      rawDataTaxonomies_schema.parse(
        await fetchJsonData('taxonomies')
      )
    )
  }
)

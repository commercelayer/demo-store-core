import { fetchData } from '#utils/data'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { RawDataCatalog, rawDataCatalogs_schema, RawDataTaxon, rawDataTaxonomies_schema, RawDataTaxonomy, rawDataTaxons_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataTaxons = memoize(
  async function (): Promise<Unserializable<RawDataTaxon[]>> {
    return makeUnserializable(
      rawDataTaxons_schema.parse(
        await fetchData('taxons')
      )
    )
  }
)

export const getRawDataTaxonomies = memoize(
  async function (): Promise<Unserializable<RawDataTaxonomy[]>> {
    return makeUnserializable(
      rawDataTaxonomies_schema.parse(
        await fetchData('taxonomies')
      )
    )
  }
)

export const getRawDataCatalogs = memoize(
  async function (): Promise<Unserializable<RawDataCatalog[]>> {
    return makeUnserializable(
      rawDataCatalogs_schema.parse(
        await fetchData('catalogs')
      )
    )
  }
)

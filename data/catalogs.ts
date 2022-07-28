import { fetchData } from '#utils/data'
import { localizedFieldSchema } from '#utils/locale'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataTaxons = memoize(
  async function (): Promise<Unserializable<RawDataTaxon[]>> {
    return makeUnserializable(
      taxonSchema.array().parse(
        await fetchData('taxons')
      )
    )
  }
)

export const getRawDataTaxonomies = memoize(
  async function (): Promise<Unserializable<RawDataTaxonomy[]>> {
    return makeUnserializable(
      taxonomySchema.array().parse(
        await fetchData('taxonomies')
      )
    )
  }
)

export const getRawDataCatalogs = memoize(
  async function (): Promise<Unserializable<RawDataCatalog[]>> {
    return makeUnserializable(
      catalogSchema.array().parse(
        await fetchData('catalogs')
      )
    )
  }
)

const catalogSchema = z.object({
  id: z.string(),
  name: z.string(),
  taxonomies: z.string().array()
})

const taxonomySchema = z.object({
  id: z.string(),
  name: z.string(),
  facetKey: z.string(),
  taxons: z.string().array()
})

const taxonSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  references: z.string().array(),
  taxons: z.string().array().optional()
})

export type RawDataCatalog = z.infer<typeof catalogSchema>
export type RawDataTaxonomy = z.infer<typeof taxonomySchema>
export type RawDataTaxon = z.infer<typeof taxonSchema>

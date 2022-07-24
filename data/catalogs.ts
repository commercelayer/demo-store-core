import { localizedFieldSchema } from '#utils/locale'
import { makeUnserializable, Unserializable, unserializableSchema } from '#utils/unserializable'
import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataTaxons = memoize(
  async function (): Promise<Unserializable<RawDataTaxon[]>> {
    const dataFolder = './json'
    const jsonData = (await import(`${dataFolder}/taxons.json`)).default

    return makeUnserializable(
      taxonSchema.array().parse(jsonData)
    )
  }
)

export const getRawDataTaxonomies = memoize(
  async function (): Promise<Unserializable<RawDataTaxonomy[]>> {
    const dataFolder = './json'
    const jsonData = (await import(`${dataFolder}/taxonomies.json`)).default

    return makeUnserializable(
      taxonomySchema.array().parse(jsonData)
    )
  }
)

export const getRawDataCatalogs = memoize(
  async function (): Promise<Unserializable<RawDataCatalog[]>> {
    const dataFolder = './json'
    const jsonData = (await import(`${dataFolder}/catalogs.json`)).default

    return makeUnserializable(
      catalogSchema.array().parse(jsonData)
    )
  }
)


import catalogsJson from '#data/json/catalogs.json'
import taxonomiesJson from '#data/json/taxonomies.json'
import taxonsJson from '#data/json/taxons.json'

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

// TODO: remove it
export const rawDataCatalogs = unserializableSchema(catalogSchema.array())
  .parse({
    data: catalogsJson
  })

// TODO: remove it
export const rawDataTaxonomies = unserializableSchema(taxonomySchema.array())
  .parse({
    data: taxonomiesJson
  })

// TODO: remove it
export const rawDataTaxons = unserializableSchema(taxonSchema.array())
  .parse({
    data: taxonsJson
  })

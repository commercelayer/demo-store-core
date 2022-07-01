import { localizedFieldSchema } from '#i18n/locale'
import { unserializableSchema } from '#utils/unserializable'
import { z } from 'zod'

import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'

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

export const rawDataCatalogs = unserializableSchema(catalogSchema.array())
  .parse({
    data: catalogsJson
  })

export const rawDataTaxonomies = unserializableSchema(taxonomySchema.array())
  .parse({
    data: taxonomiesJson
  })

export const rawDataTaxons = unserializableSchema(taxonSchema.array())
  .parse({
    data: taxonsJson
  })

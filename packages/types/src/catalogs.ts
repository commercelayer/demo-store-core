import { z } from 'zod'
import { localizedFieldSchema } from './locale'

const catalog_schema = z.object({
  id: z.string(),
  name: z.string(),
  taxonomies: z.string().array()
})

const taxonomy_schema = z.object({
  id: z.string(),
  name: z.string(),
  facetKey: z.string(),
  taxons: z.string().array()
})

const taxon_schema = z.object({
  id: z.string(),
  name: z.string(),
  label: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  references: z.string().array(),
  taxons: z.string().array().optional()
})

export const rawDataCatalogs_schema = catalog_schema.array()
export const rawDataTaxonomies_schema = taxonomy_schema.array()
export const rawDataTaxons_schema = taxon_schema.array()

export type RawDataCatalog = z.infer<typeof catalog_schema>
export type RawDataTaxonomy = z.infer<typeof taxonomy_schema>
export type RawDataTaxon = z.infer<typeof taxon_schema>

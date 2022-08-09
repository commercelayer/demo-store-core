import { z } from 'zod'

const taxonomy_schema = z.object({
  id: z.string(),
  name: z.string(),
  facetKey: z.string(),
  taxons: z.string().array()
})

export const rawDataTaxonomies_schema = taxonomy_schema.array()

export type RawDataTaxonomy = z.infer<typeof taxonomy_schema>

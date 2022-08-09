import { z } from 'zod'
import { localizedFieldSchema } from '../utils/locale'

const taxon_schema = z.object({
  id: z.string(),
  name: z.string(),
  label: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  references: z.string().array(),
  taxons: z.string().array().optional()
})

export const rawDataTaxons_schema = taxon_schema.array()

export type RawDataTaxon = z.infer<typeof taxon_schema>

import { z } from 'zod'

const catalog_schema = z.object({
  id: z.string(),
  name: z.string(),
  taxonomies: z.string().array()
})

export const rawDataCatalogs_schema = catalog_schema.array()

export type RawDataCatalog = z.infer<typeof catalog_schema>

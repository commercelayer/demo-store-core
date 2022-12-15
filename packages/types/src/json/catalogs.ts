import { z } from 'zod'

const catalog_schema = z.object({
  /**
   * Catalog id
   * 
   * This information is used to manage the relationship with `country`es and `language`s.
   */
  id: z.string(),

  /**
   * Catalog name
   * 
   * This information is used to better identify the catalog. **Not used on the website**.
   */
  name: z.string(),

  /**
   * // TODO:
   */
  taxonomies: z.string().array()
})

export const rawDataCatalogs_schema = catalog_schema.array()

export type RawDataCatalog = z.infer<typeof catalog_schema>

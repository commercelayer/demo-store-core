import { z } from 'zod'

type RawDataCatalogSchema = z.ZodObject<{
  /**
   * Catalog id
   * 
   * This attribute is used to manage the relationship with `countries` and `languages`.
   */
  id: z.ZodString

  /**
   * Catalog name
   * 
   * This attribute is used to better identify the catalog. **Not used on the website**.
   */
  name: z.ZodString

  /**
   * Reference to the `taxonomies` id
   *
   * Taxonomies are an approach to managing category trees.
   * The heading of a tree is called `taxonomy`.
   * Any child branches are called `taxons`. Taxons themselves can have their own branches.
   *
   * ![Taxonomies](https://user-images.githubusercontent.com/1681269/208094651-b2942235-4d6d-40fb-8230-da2e79d11231.png|width=400px)
   */
  taxonomies: z.ZodArray<z.ZodString>
}>

const rawDataCatalog_schema: RawDataCatalogSchema = z.object({
  id: z.string(),
  name: z.string(),
  taxonomies: z.string().array()
})

export const rawDataCatalogs_schema = rawDataCatalog_schema.array()

/**
 * Product catalog
 * 
 * A catalog is a collection of taxonomies.
 * 
 * Taxonomies are an approach to managing category trees.
 * The heading of a tree is called `taxonomy`.
 * Any child branches are called `taxons`. Taxons themselves can have their own branches.
 *
 * ![Taxonomy Tree](https://user-images.githubusercontent.com/1681269/208085444-a4daf89a-7038-4ff7-a7ab-d5218efbfdb7.png|width=400px)
 */
export type RawDataCatalog = z.infer<RawDataCatalogSchema>

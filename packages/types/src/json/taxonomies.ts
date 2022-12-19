import { z } from 'zod'

type RawDataTaxonomySchema = z.ZodObject<{
  /**
   * The taxonomy id
   * 
   * This attribute is used to manage the relationship with `catalogs`.
   */
  id: z.ZodString

  /**
   * The taxonomy name
   * 
   * This attribute is used to better identify the taxonomy. **Not used on the website**.
   */
  name: z.ZodString

  /**
   * The facet key is used inside the `facets.config.js` to define a facet.
   * 
   * When you define a facet field in the `facets.config.js` that corresponds to a `facetKey`, the related taxonomy will be shown in the filter component.
   * 
   * ![Taxonomies `gender` and `category` are visible in the filter component](https://user-images.githubusercontent.com/1681269/208090019-96b8b72c-bd2c-4125-a226-372443c87e4c.png|width=400px)
   */
  facetKey: z.ZodString

  /**
   * Reference to the `taxons` id
   *
   * Any child branches of a `taxonomy` are called `taxons`. Taxons themselves can have their own branches.
   *
   * ![Taxons - first level](https://user-images.githubusercontent.com/1681269/208094648-d8e8cb24-5a26-47b8-9cef-351a3b44e263.png|width=400px)
   */
  taxons: z.ZodArray<z.ZodString>
}>

const rawDataTaxonomy_schema: RawDataTaxonomySchema = z.object({
  id: z.string(),
  name: z.string(),
  facetKey: z.string(),
  taxons: z.string().array()
})

export const rawDataTaxonomies_schema = rawDataTaxonomy_schema.array()

/**
 * Taxonomy
 * 
 * Taxonomies are an approach to managing category trees.
 * The heading of a tree is called `taxonomy`.
 * 
 * For example, you can create a taxonomy for managing product categories, or for grouping products by their gender.
 *
 * ![Taxonomies](https://user-images.githubusercontent.com/1681269/208094651-b2942235-4d6d-40fb-8230-da2e79d11231.png|width=400px)
 */
export type RawDataTaxonomy = z.infer<RawDataTaxonomySchema>

import { z } from 'zod'
import { LocalizedFieldSchema, localizedFieldSchema } from '../utils/locale'

type RawDataTaxonSchema = z.ZodObject<{
  /**
   * The taxonomy id
   * 
   * This attribute is used to manage the relationship with both `taxonomies` and `taxons`.
   */
  id: z.ZodString

  /**
   * The taxon name
   * 
   * This attribute is used to better identify the taxon. **Not used on the website**.
   */
  name: z.ZodString

  /**
   * The localized label used on the website
   * 
   * @example
   * {
   *   "it": "Etichetta",
   *   "en-US": "Label"
   * }
   */
  label: LocalizedFieldSchema<z.ZodString>

  /**
   * The localized description used on the website
   * 
   * @example
   * {
   *   "it": "Descrizione",
   *   "en-US": "Description"
   * }
   */
  description: LocalizedFieldSchema<z.ZodString>

  /**
   * The taxon URL slug
   * 
   * The slug is the part of a URL that identifies a particular page on a website in an easy-to-read form.
   * 
   * It should always start with a forward slash (`/`).
   * @example "/clothing/shirts"
   */
  slug: z.ZodEffects<z.ZodString>

  /**
   * The list of `products` SKUs
   * 
   * This is an array of product `SKU`s (from `products.json`).
   * @example ["APRONXXX000000FFFFFFXXXX", "BABYBIBXA19D9D000000XXXX"]
   */
  references: z.ZodArray<z.ZodString>

  /**
   * Reference to the `taxons` id
   *
   * Any child branches of a `taxonomy` are called `taxons`. **Taxons themselves can have their own branches.**
   *
   * ![Taxons](https://user-images.githubusercontent.com/1681269/208094650-85d0c4eb-13f6-4c5a-9737-9e224d597c2b.png|width=400px)
   */
  taxons: z.ZodOptional<z.ZodArray<z.ZodString>>
}>

const rawDataTaxon_schema: RawDataTaxonSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  references: z.string().array(),
  taxons: z.string().array().optional()
})

export const rawDataTaxons_schema = rawDataTaxon_schema.array()

/**
 * Taxon
 * 
 * Any child branches of a `taxonomy` are called `taxons`. Taxons themselves can have their own branches.
 *
 * ![Taxons](https://user-images.githubusercontent.com/1681269/208096330-72ed35f9-74ef-4414-9b11-7f97a7b0687f.png|width=400px)
 */
export type RawDataTaxon = z.infer<RawDataTaxonSchema>

import { z } from 'zod'

export type ProductGridSchema = z.ZodObject<{
  /**
   * Identifies the component type
   */
  type: z.ZodLiteral<'product-grid'>

  /**
   * Unique ID
   */
  id: z.ZodString

  /**
   * The product grid title
   */
  title: z.ZodString

  /**
   * List of SKUs from `products.json` file
   */
  skus: z.ZodArray<z.ZodString>
}>

export const productGrid_schema: ProductGridSchema = z.object({
  type: z.literal('product-grid'),
  id: z.string(),
  title: z.string(),
  skus: z.string().array()
})

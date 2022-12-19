import { z } from 'zod'
import { localizedFieldSchema, LocalizedFieldSchema } from '../utils/locale'

type DetailSchema = z.ZodObject<{
  /**
   * Accordion title
   */
  title: LocalizedFieldSchema<z.ZodString>

  /**
   * Accordion content
   */
  content: LocalizedFieldSchema<z.ZodString>
}>

const detail_schema: DetailSchema = z.object({
  /**
   * Accordion title
   */
  title: localizedFieldSchema(z.string()),

  /**
   * Accordion content
   */
  content: localizedFieldSchema(z.string())
})

type RawDataProductSchema = z.ZodObject<{
  /**
   * The **product code** identifies the base product
   * 
   * A master product or base product is a non-sellable product that represents a group of similar or related products.
   * 
   * For example, a clothing retailer may have a master product for each type of clothing item, such as "men's t-shirts" or "women's dresses".
   * Each of these master products would contain multiple variations, such as different sizes, colors, and styles. 
   */
  productCode: z.ZodString

  /**
   * The **variant code** identifies a variation product
   * 
   * A variation product is a product that is part of a group of similar or related products,
   * and it is identified by specific attributes or characteristics that distinguish it from the other products in the group (color, material, size, etc.).
   * 
   * The `variantCode`, in Demo Store, is used for grouping similar products in the listing page.
   * Usually a different `variantCode` corresponds to a different product image.
   */
  variantCode: z.ZodString

  /**
   * The **sku** is a **unique identifier**, meaning *Stock Keeping Unit*.
   * 
   * This is the stock unit in a warehouse used to track availability and stock variations of an item to be sold.
   * SKUs can be a variant of any item (e.g., Medium or Large size of a jogger pant).
   * 
   * An SKU usually consists of letters and numbers (either EAN code, UPC, or any other code format) like "LSLEEVMM000000FFFFFFMXXX".
   * SKU refers to an item's details, including variants data (e.g., a T-shirt, Red color, Nike brand, 0.5g, XL size).
   * An SKU identifies each product item's characteristics such as manufacturer name, brand name, style, color, weight, and size.
   */
  sku: z.ZodString

  /**
   * The product URL slug
   * 
   * The slug is the part of a URL that identifies a particular page on a website in an easy-to-read form.
   * 
   * It should always start with a forward slash (`/`).
   * @example "/white-apron-with-black-logo/APRONXXXFFFFFF000000XXXX"
   */
  slug: z.ZodEffects<z.ZodString>

  /**
   * The localized product name
   * 
   * @example
   * {
   *   "it": "Maglietta Grigia",
   *   "en-US": "Gray T-Shirt"
   * }
   */
  name: LocalizedFieldSchema<z.ZodString>

  /**
   * The localized product description
   * 
   * @example
   * {
   *   "it": "Descrizione"
   *   "en-US": "Description",
   * }
   */
  description: LocalizedFieldSchema<z.ZodString>

  /**
   * A carousel of image URLs that represent the product
   * 
   * @example
   * [
   *   "https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/TSHIRTMSB0B0B2000000LXXX_FLAT.png"
   * ]
   */
  images: z.ZodArray<z.ZodString>,

  /**
   * Additional product details
   * 
   * This attribute is presented as accordion just below the "Add to cart" button.
   * 
   * @example
   * [
   *   {
   *     "title": {
   *       "en": "Details"
   *     },
   *     "content": {
   *       "en": "Content here."
   *     }
   *   }
   * ]
   */
  details: z.ZodOptional<z.ZodArray<DetailSchema>>
}>

const rawDataProduct_schema: RawDataProductSchema = z.object({
  productCode: z.string(),
  variantCode: z.string(),
  sku: z.string(),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  name: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  images: z.string().array(),
  details: detail_schema.array().optional()
})

export const rawDataProducts_schema = rawDataProduct_schema.passthrough().array()

/**
 * Product
 * 
 * A product that can be purchased since it has a `sku` property.
 * 
 * Products need to be assigned to a `taxon` to be visible in the Demo Store.
 */
export type RawDataProduct = z.infer<RawDataProductSchema>

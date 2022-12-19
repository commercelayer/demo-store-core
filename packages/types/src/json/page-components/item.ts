import { z } from 'zod'
import { ImageSchema, image_schema } from './image'

export type ItemSchema = z.ZodObject<{
  /**
   * The title
   */
  title: z.ZodString

  /**
   * The description
   */
  description: z.ZodString

  /**
   * The image
   */
  image: ImageSchema

  /**
   * The button link label
   * 
   * @example "Shop here"
   */
  linkLabel: z.ZodString

  /**
   * The button link URL
   * 
   * URL can be an internal one starting with `/` or an external one starting with `https://`.
   * 
   * @example "/search/bags"
   */
  linkHref: z.ZodString
}>

export const item_schema: ItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: image_schema,
  linkLabel: z.string(),
  linkHref: z.string()
})

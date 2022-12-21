import { z } from 'zod'
import { ImageSchema, image_schema } from './image'

export type HeroSchema = z.ZodObject<{
  /**
   * Identifies the component type
   */
  type: z.ZodLiteral<'hero'>

  /**
   * Unique ID
   */
  id: z.ZodString

  /**
   * The hero image
   */
  image: ImageSchema,

  /**
   * The hero title
   */
  title: z.ZodString

  /**
   * The hero description
   */
  description: z.ZodOptional<z.ZodString>

  /**
   * The hero link URL
   * 
   * URL can be an internal one starting with `/` or an external one starting with `https://`.
   * 
   * @example "/search/bags"
   */
  href: z.ZodString
}>

export const hero_schema: HeroSchema = z.object({
  type: z.literal('hero'),
  id: z.string(),
  image: image_schema,
  title: z.string(),
  description: z.string().optional(),
  href: z.string()
})

import { z } from 'zod'
import { ItemSchema, item_schema } from './item'

export type CarouselSchema = z.ZodObject<{
  /**
   * Identifies the component type
   */
  type: z.ZodLiteral<'carousel'>

  /**
   * Unique ID
   */
  id: z.ZodString

  /**
   * Array of carousel slides
   * 
   * A single slide is composed by a `title`, a `description`, an `image`, and a button link.
   */
  slides: z.ZodArray<ItemSchema>
}>

export const carousel_schema: CarouselSchema = z.object({
  type: z.literal('carousel'),
  id: z.string(),
  slides: item_schema.array()
})

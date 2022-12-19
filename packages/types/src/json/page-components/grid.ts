import { z } from 'zod'
import { ItemSchema, item_schema } from './item'

export type GridSchema = z.ZodObject<{
  /**
   * Identifies the component type
   */
  type: z.ZodLiteral<'grid'>

  /**
   * Unique ID
   */
  id: z.ZodString

  /**
   * List of items to show in the grid
   */
  items: z.ZodArray<ItemSchema>
}>

export const grid_schema: GridSchema = z.object({
  type: z.literal('grid'),
  id: z.string(),
  items: item_schema.array()
})

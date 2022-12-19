import { z } from 'zod'

export type ImageSchema = z.ZodObject<{
  /**
   * Image source
   */
  src: z.ZodString

  /**
   * Alternative text
   */
  alt: z.ZodString
}>

export const image_schema: ImageSchema = z.object({
  src: z.string(),
  alt: z.string()
})

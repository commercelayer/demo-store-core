import { z } from 'zod'

export type MarkdownSchema = z.ZodObject<{
  /**
   * Identifies the component type
   */
  type: z.ZodLiteral<'markdown'>

  /**
   * Unique ID
   */
  id: z.ZodString

  /**
   * The markdown content
   * 
   * When the page already has a `title` attribute, the markdown content should not start with a `#` (markdown title) to avoid a second `<h1>` title on the page.
   */
  content: z.ZodString
}>

export const markdown_schema: MarkdownSchema = z.object({
  /**
   * Identifies the component type
   */
  type: z.literal('markdown'),

  /**
   * Unique ID
   */
  id: z.string(),

  /**
   * The markdown content
   * 
   * When the page already has a `title` attribute, the markdown content should not start with a `#` (markdown title) to avoid a second `<h1>` title on the page.
   */
  content: z.string()
})

import { z } from 'zod'
import { localizedFieldSchema } from './locale'

const image_schema = z.object({
  src: z.string(),
  alt: z.string()
})

const slide_schema = z.object({
  image: image_schema,
  title: z.string(),
  description: z.string(),
  linkLabel: z.string(),
  linkHref: z.string()
})

const carousel_schema = z.object({
  type: z.literal('carousel'),
  id: z.string(),
  slides: slide_schema.array()
})

const hero_schema = z.object({
  type: z.literal('hero'),
  id: z.string(),
  image: image_schema,
  title: z.string(),
  description: z.string().optional(),
  href: z.string()
})

const productGrid_schema = z.object({
  type: z.literal('product-grid'),
  id: z.string(),
  title: z.string(),
  skus: z.string().array()
})

const grid_schema = z.object({
  type: z.literal('grid'),
  id: z.string(),
  items: slide_schema.array()
})

const markdown_schema = z.object({
  type: z.literal('markdown'),
  id: z.string(),
  content: z.string()
})

const pages_schema = z.object({})
  .catchall(
    localizedFieldSchema(
      z.discriminatedUnion('type', [
        carousel_schema,
        grid_schema,
        hero_schema,
        productGrid_schema,
        markdown_schema,
      ]).array()
    )
  )

export const rawDataPages_schema = pages_schema

export type RawDataPages = z.infer<typeof pages_schema>

export type RawDataCarousel = z.infer<typeof carousel_schema>
export type RawDataGrid = z.infer<typeof grid_schema>
export type RawDataHero = z.infer<typeof hero_schema>
export type RawDataProductGrid = z.infer<typeof productGrid_schema>
export type RawDataMarkdown = z.infer<typeof markdown_schema>

import { localizedFieldSchema } from '#i18n/locale'
import { memo } from '#utils/memo'
import { unserializableSchema } from '#utils/unserializable'
import { z } from 'zod'

export const getRawDataPages = async (): Promise<RawDataPages> => {
  return memo(async () => {
    const dataFolder = './json'
    const pagesJson = (await import(`${dataFolder}/pages.json`)).default
    // const pagesJson = await fetch('http://localhost:3001/json/pages.json').then(response => response.json())

    return pagesSchema.parse({
      data: pagesJson
    })
  })
}


const imageSchema = z.object({
  src: z.string(),
  alt: z.string()
})

const slideSchema = z.object({
  image: imageSchema,
  title: z.string(),
  description: z.string(),
  linkLabel: z.string(),
  linkHref: z.string()
})

const carouselSchema = z.object({
  type: z.literal('carousel'),
  id: z.string(),
  slides: slideSchema.array()
})

const heroSchema = z.object({
  type: z.literal('hero'),
  id: z.string(),
  image: imageSchema,
  title: z.string(),
  description: z.string().optional(),
  href: z.string()
})

const productGridSchema = z.object({
  type: z.literal('product-grid'),
  id: z.string(),
  title: z.string(),
  skus: z.string().array()
})

const gridSchema = z.object({
  type: z.literal('grid'),
  id: z.string(),
  items: slideSchema.array()
})

const markdownSchema = z.object({
  type: z.literal('markdown'),
  id: z.string(),
  content: z.string()
})

const pagesSchema = unserializableSchema(
  z
    .object({})
    .catchall(
      localizedFieldSchema(
        z.discriminatedUnion('type', [
          carouselSchema,
          gridSchema,
          heroSchema,
          productGridSchema,
          markdownSchema,
        ]).array()
      )
    )
)

export type RawDataPages = z.infer<typeof pagesSchema>

export type RawDataCarousel = z.infer<typeof carouselSchema>
export type RawDataGrid = z.infer<typeof gridSchema>
export type RawDataHero = z.infer<typeof heroSchema>
export type RawDataProductGrid = z.infer<typeof productGridSchema>
export type RawDataMarkdown = z.infer<typeof markdownSchema>

import { localizedFieldSchema } from '#i18n/locale'
import { unserializableSchema } from '#utils/unserializable'
import { z } from 'zod'

import homepageJson from './json/homepage.json'

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

const gridSchema = z.object({
  type: z.literal('grid'),
  id: z.string(),
  items: slideSchema.array()
})

const homepageSchema = unserializableSchema(
  localizedFieldSchema(
    z.discriminatedUnion('type', [
      carouselSchema,
      heroSchema,
      gridSchema
    ]).array()
  )
)

export type RawDataHomepage = z.infer<typeof homepageSchema>

export type RawDataCarousel = z.infer<typeof carouselSchema>
export type RawDataHero = z.infer<typeof heroSchema>
export type RawDataGrid = z.infer<typeof gridSchema>

export const rawDataHomepage = homepageSchema.parse({
  data: homepageJson
});

import { localizedFieldSchema } from '#i18n/locale'
import { z } from 'zod'

import homepageJson from './json/homepage.json'

const imageSchema = z.object({
  src: z.string(),
  alt: z.string()
})

const slideSchema = z.object({
  image: localizedFieldSchema(imageSchema),
  title: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  linkLabel: localizedFieldSchema(z.string()),
  linkHref: localizedFieldSchema(z.string())
})

const carouselSchema = z.object({
  type: z.literal('carousel'),
  slides: slideSchema.array()
})

const heroSchema = z.object({
  type: z.literal('hero'),
  image: localizedFieldSchema(imageSchema),
  title: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()).optional(),
  href: localizedFieldSchema(z.string())
})

const gridSchema = z.object({
  type: z.literal('grid'),
  items: slideSchema.array()
})

const homepageSchema = z.object({
  _unserializable: z.unknown().default(Symbol.for('unserializable')),
  data: z.discriminatedUnion('type', [
    carouselSchema,
    heroSchema,
    gridSchema
  ]).array()
})

export type RawDataHomepage = z.infer<typeof homepageSchema>

export type RawDataCarousel = z.infer<typeof carouselSchema>
export type RawDataHero = z.infer<typeof heroSchema>
export type RawDataGrid = z.infer<typeof gridSchema>

export const rawDataHomepage = homepageSchema.parse({
  data: homepageJson
});

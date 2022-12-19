import { z } from 'zod'
import { LocalizedFieldSchema, localizedFieldSchema } from '../utils/locale'
import { CarouselSchema, carousel_schema } from './page-components/carousel'
import { GridSchema, grid_schema } from './page-components/grid'
import { HeroSchema, hero_schema } from './page-components/hero'
import { MarkdownSchema, markdown_schema } from './page-components/markdown'
import { ProductGridSchema, productGrid_schema } from './page-components/product-grid'

type RawDataPageSchema = z.ZodObject<{
  /**
   * The page title
   * 
   * This title is also used to display the browser title (`<title>Page title</title>`)
   * @example "Page title"
   */
  title: z.ZodOptional<z.ZodString>

  /**
   * The page description
   * 
   * This description is also used to set the browser description (`<meta name="description" content="This is the page description"/>`)
   * @example "This is the page description"
   */
  description: z.ZodOptional<z.ZodString>

  /** List of page components */
  components: z.ZodArray<z.ZodDiscriminatedUnion<'type', [
    CarouselSchema,
    GridSchema,
    HeroSchema,
    ProductGridSchema,
    MarkdownSchema
  ]>>
}>

export const rawDataPage_schema: RawDataPageSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  components: z.discriminatedUnion('type', [
    carousel_schema,
    grid_schema,
    hero_schema,
    productGrid_schema,
    markdown_schema,
  ]).array()
})

type RawDataLocalizedPageSchema = LocalizedFieldSchema<RawDataPageSchema>

const rawDataLocalizedPage_schema: RawDataLocalizedPageSchema = localizedFieldSchema(rawDataPage_schema)

type PagesSchema<T extends z.ZodTypeAny> = z.ZodObject<
  {},
  "strip",
  T,
  { [urlSlug: string]: z.infer<T> },
  { [urlSlug: string]: z.infer<T> }
>

type RawDataPagesSchema = PagesSchema<RawDataLocalizedPageSchema>

export const rawDataPages_schema: RawDataPagesSchema = z
  .object({})
  .catchall(rawDataLocalizedPage_schema)


/**
 * Demo Store page
 * 
 * This represent an editorial page. A page is composed by a `title`, a `description` and a list of `components`.
 */
export type RawDataPage = z.infer<RawDataPageSchema>

/**
 * A page with different locales.
 * 
 * On international website, an editorial page may have a different set of components based on the language or country.
 * 
 * @example
 * {
 *   "en": {
 *     "title": "English title",
 *     "components": [ ... ]
 *   },
*   "it": {
 *     "title": "Italian title",
 *     "components": [ ... ]
 *   }
 * }
 */
export type RawDataLocalizedPage = z.infer<RawDataLocalizedPageSchema>

/**
 * Demo Store editorial pages
 * 
 * This represent all the editorial pages of your website.
 * 
 * The ___first key___ of the object represent the **URL slug**. It should always start with a forward slash (`/`) (e.g. _The urlSlug `"/"` correspond to the homepage_).
 * 
 * The ___second key___ of the object represent the **locale code**.
 * 
 * @example
 * {
 *   "/": {
 *     "en": {
 *       "title": "English title",
 *       "components": [ ... ]
 *     },
 *     "it": {
 *       "title": "Italian title",
 *       "components": [ ... ]
 *     }
 *   },
 *   "/privacy-policy": {
 *     "en": {
 *       "title": "English title",
 *       "components": [ ... ]
 *     },
 *     "it": {
 *       "title": "Italian title",
 *       "components": [ ... ]
 *     }
 *   }
 * }
 */
export type RawDataPages = z.infer<typeof rawDataPages_schema>

/**
 * Carousel component for editorial pages
 * 
 * ![Carousel component](https://user-images.githubusercontent.com/1681269/208413738-5223703c-2baf-40ad-ba8f-75b32691f992.png|width=400px)
 */
export type RawDataCarousel = z.infer<CarouselSchema>

/**
 * Grid component for editorial pages
 * 
 * ![Grid component](https://user-images.githubusercontent.com/1681269/208413948-b49a33fc-5778-4e9f-8d47-d3c546a3403f.png|width=400px)
 */
export type RawDataGrid = z.infer<GridSchema>

/**
 * Hero component for editorial pages
 * 
 * ![Hero component](https://user-images.githubusercontent.com/1681269/208413828-f6e0a5a6-ae9c-40fe-a80a-f1be1e400866.png|width=400px)
 */
export type RawDataHero = z.infer<HeroSchema>

/**
 * Product Grid component for editorial pages
 * 
 * ![Product Grid component](https://user-images.githubusercontent.com/1681269/208413888-81d6a60f-3ad2-49ba-91c8-40ff91d1385d.png|width=400px)
 */
export type RawDataProductGrid = z.infer<ProductGridSchema>

/**
 * Markdown component for editorial pages
 */
export type RawDataMarkdown = z.infer<MarkdownSchema>

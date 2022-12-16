import { z } from 'zod'
import { localizedFieldSchema } from '../utils/locale'

const image_schema = z.object({
  /**
   * Image source
   */
  src: z.string(),

  /**
   * Alternative text
   */
  alt: z.string()
})

const item_schema = z.object({
  /**
   * The title
   */
  title: z.string(),

  /**
   * The description
   */
  description: z.string(),

  /**
   * The image
   */
  image: image_schema,

  /**
   * The button link label
   * 
   * @example "Shop here"
   */
  linkLabel: z.string(),

  /**
   * The button link URL
   * 
   * URL can be an internal one starting with `/` or an external one starting with `https://`.
   * 
   * @example "/search/bags"
   */
  linkHref: z.string()
})

const carousel_schema = z.object({
  /**
   * Identifies the component type
   */
  type: z.literal('carousel'),

  /**
   * Unique ID
   */
  id: z.string(),

  /**
   * Array of carousel slides
   * 
   * A single slide is composed by a `title`, a `description`, an `image`, and a button link.
   */
  slides: item_schema.array()
})

const hero_schema = z.object({
  /**
   * Identifies the component type
   */
  type: z.literal('hero'),

  /**
   * Unique ID
   */
  id: z.string(),

  /**
   * The hero image
   */
  image: image_schema,

  /**
   * The hero title
   */
  title: z.string(),

  /**
   * The hero description
   */
  description: z.string().optional(),

  /**
   * The hero link URL
   * 
   * URL can be an internal one starting with `/` or an external one starting with `https://`.
   * 
   * @example "/search/bags"
   */
  href: z.string()
})

const productGrid_schema = z.object({
  /**
   * Identifies the component type
   */
  type: z.literal('product-grid'),

  /**
   * Unique ID
   */
  id: z.string(),

  /**
   * The product grid title
   */
  title: z.string(),

  /**
   * List of SKUs from `products.json` file
   */
  skus: z.string().array()
})

const grid_schema = z.object({
  /**
   * Identifies the component type
   */
  type: z.literal('grid'),

  /**
   * Unique ID
   */
  id: z.string(),

  /**
   * List of items to show in the grid
   */
  items: item_schema.array()
})

const markdown_schema = z.object({
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


const page_schema = z.object({
  /**
   * The page title
   * 
   * This title is also used to display the browser title (`<title>Page title</title>`)
   * @example "Page title"
   */
  title: z.string().optional(),

  /**
   * The page description
   * 
   * This description is also used to set the browser description (`<meta name="description" content="This is the page description"/>`)
   * @example "This is the page description"
   */
  description: z.string().optional(),

  /** List of page components */
  components: z.discriminatedUnion('type', [
    carousel_schema,
    grid_schema,
    hero_schema,
    productGrid_schema,
    markdown_schema,
  ]).array()
})

const localizedPage_schema = localizedFieldSchema(page_schema)

type PagesSchema<T extends z.ZodTypeAny> = z.ZodObject<
  {},
  "strip",
  T,
  { [urlSlug: string]: z.infer<T> },
  { [urlSlug: string]: z.infer<T> }
>

const pages_schema: PagesSchema<typeof localizedPage_schema> = z
  .object({})
  .catchall(localizedPage_schema)

export const rawDataPages_schema = pages_schema

/**
 * Demo Store page
 * 
 * This represent an editorial page. A page is composed by a `title`, a `description` and a list of `components`.
 */
export type RawDataPage = z.infer<typeof page_schema>

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
export type RawDataLocalizedPage = z.infer<typeof localizedPage_schema>

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
export type RawDataPages = z.infer<typeof pages_schema>

/**
 * Carousel component for editorial pages
 * 
 * ![Carousel component](https://user-images.githubusercontent.com/1681269/208413738-5223703c-2baf-40ad-ba8f-75b32691f992.png|width=400px)
 */
export type RawDataCarousel = z.infer<typeof carousel_schema>

/**
 * Grid component for editorial pages
 * 
 * ![Grid component](https://user-images.githubusercontent.com/1681269/208413948-b49a33fc-5778-4e9f-8d47-d3c546a3403f.png|width=400px)
 */
export type RawDataGrid = z.infer<typeof grid_schema>

/**
 * Hero component for editorial pages
 * 
 * ![Hero component](https://user-images.githubusercontent.com/1681269/208413828-f6e0a5a6-ae9c-40fe-a80a-f1be1e400866.png|width=400px)
 */
export type RawDataHero = z.infer<typeof hero_schema>

/**
 * Product Grid component for editorial pages
 * 
 * ![Product Grid component](https://user-images.githubusercontent.com/1681269/208413888-81d6a60f-3ad2-49ba-91c8-40ff91d1385d.png|width=400px)
 */
export type RawDataProductGrid = z.infer<typeof productGrid_schema>

/**
 * Markdown component for editorial pages
 */
export type RawDataMarkdown = z.infer<typeof markdown_schema>

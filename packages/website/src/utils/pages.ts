import { getRawDataPages } from '#data/pages'
import { getRawDataProducts } from '#data/products'
import { translateField } from '#utils/locale'
import { memoize } from '#utils/memoize'
import type { RawDataCarousel, RawDataGrid, RawDataHero, RawDataMarkdown, RawDataProductGrid } from '@commercelayer/demo-store-types'
import { getProductWithVariants, LocalizedProductWithVariant } from './products'

export type Image = {
  src: string
  alt: string
}

export type CarouselPageComponent = {
  type: 'carousel'
  id: string
  slides: {
    image: Image
    title: string
    description: string
    linkLabel: string
    linkHref: string
  }[]
}

export type HeroPageComponent = {
  type: 'hero'
  id: string
  image: Image
  title: string
  description: string | null
  href: string
}

export type ProductGridPageComponent = {
  type: 'product-grid'
  id: string
  title: string
  products: LocalizedProductWithVariant[]
}

export type GridPageComponent = {
  type: 'grid'
  id: string
  items: {
    image: Image
    title: string
    description: string
    linkLabel: string
    linkHref: string
  }[]
}

export type MarkdownPageComponent = {
  type: 'markdown'
  id: string
  content: string
}

export type PageComponent = (
  | CarouselPageComponent
  | HeroPageComponent
  | ProductGridPageComponent
  | GridPageComponent
  | MarkdownPageComponent
)

export type CustomPage = {
  slug: string
  title: string | null
  description: string | null
  components: PageComponent[]
}

const getCarouselPageComponent = async (rawData: RawDataCarousel, _localeCode: string): Promise<CarouselPageComponent> => {
  return {
    type: 'carousel',
    id: rawData.id,
    slides: rawData.slides.map(slide => ({
      image: slide.image,
      title: slide.title,
      description: slide.description,
      linkLabel: slide.linkLabel,
      linkHref: slide.linkHref
    }))
  }
}

const getHeroPageComponent = async (rawData: RawDataHero, _localeCode: string): Promise<HeroPageComponent> => {
  return {
    type: 'hero',
    id: rawData.id,
    description: rawData.description || null,
    href: rawData.href,
    image: rawData.image,
    title: rawData.title
  }
}

const getProductGridPageComponent = async (rawData: RawDataProductGrid, localeCode: string): Promise<ProductGridPageComponent> => {
  const rawDataProducts = await getRawDataProducts()
  return {
    type: 'product-grid',
    id: rawData.id,
    title: rawData.title,
    products: rawData.skus.map(sku => getProductWithVariants(sku, localeCode, rawDataProducts))
  }
}

const getGridPageComponent = async (rawData: RawDataGrid): Promise<GridPageComponent> => {
  return {
    type: 'grid',
    id: rawData.id,
    items: rawData.items.map(item => ({
      image: item.image,
      title: item.title,
      description: item.description,
      linkLabel: item.linkLabel,
      linkHref: item.linkHref
    }))
  }
}

const getMarkdownPageComponent = async (rawData: RawDataMarkdown): Promise<MarkdownPageComponent> => {
  return {
    type: 'markdown',
    id: rawData.id,
    content: rawData.content
  }
}

const componentMapper: Record<PageComponent['type'], (rawData: any, localeCode: string) => Promise<any>> = {
  'carousel': getCarouselPageComponent,
  'grid': getGridPageComponent,
  'hero': getHeroPageComponent,
  'product-grid': getProductGridPageComponent,
  'markdown': getMarkdownPageComponent,
}

export const getPages = memoize(
  async (localeCode: string): Promise<CustomPage[]> => {
    const rawDataPages = await getRawDataPages()
    return await Promise.all(
      Object.keys(rawDataPages.value).map(async (slug) => {
        const localizedPage = translateField(rawDataPages.value, slug, localeCode)

        const components = await Promise.all(
          localizedPage.components
            .map(component => componentMapper[component.type](component, localeCode))
        )

        return {
          slug: slug.replace(/^\//, ''),
          title: localizedPage.title || null,
          description: localizedPage.description || null,
          components
        }
      })
    )
  }
)

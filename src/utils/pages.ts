import { RawDataCarousel, RawDataGrid, RawDataHero, rawDataPages, RawDataProductGrid } from '#data/pages'
import { rawDataProducts } from '#data/products'
import { translateField } from '#i18n/locale'
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

export type PageComponent = (
  | CarouselPageComponent
  | HeroPageComponent
  | ProductGridPageComponent
  | GridPageComponent
)

export type CustomPage = {
  slug: string
  components: PageComponent[]
}

const getCarouselPageComponent = (rawData: RawDataCarousel, _localeCode: string): CarouselPageComponent => {
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

const getHeroPageComponent = (rawData: RawDataHero, _localeCode: string): HeroPageComponent => {
  return {
    type: 'hero',
    id: rawData.id,
    description: rawData.description || null,
    href: rawData.href,
    image: rawData.image,
    title: rawData.title
  }
}

const getProductGridPageComponent = (rawData: RawDataProductGrid, localeCode: string): ProductGridPageComponent => {
  return {
    type: 'product-grid',
    id: rawData.id,
    title: rawData.title,
    products: rawData.skus.map(sku => getProductWithVariants(sku, localeCode, rawDataProducts))
  }
}

const getGridPageComponent = (rawData: RawDataGrid): GridPageComponent => {
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

const componentMapper: Record<PageComponent['type'], (rawData: any, localeCode: string) => any> = {
  'carousel': getCarouselPageComponent,
  'grid': getGridPageComponent,
  'hero': getHeroPageComponent,
  'product-grid': getProductGridPageComponent,
}

export const getPages = (localeCode: string): CustomPage[] => {
  return Object.entries(rawDataPages.data).map(([slug, page]) => ({
    slug,
    components: translateField(page, localeCode)
      .map(component => componentMapper[component.type](component, localeCode))
  }))
}

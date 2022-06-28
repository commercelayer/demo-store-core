import { RawDataCarousel, RawDataGrid, RawDataHero, rawDataHomepage } from '#data/homepage'
import { translateField } from '#i18n/locale'

type Image = {
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

export type CustomPage = (
  | CarouselPageComponent
  | HeroPageComponent
  | GridPageComponent
)[]

const getCarouselPageComponent = (rawData: RawDataCarousel): CarouselPageComponent => {
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

const getHeroPageComponent = (rawData: RawDataHero): HeroPageComponent => {
  return {
    type: 'hero',
    id: rawData.id,
    description: rawData.description || null,
    href: rawData.href,
    image: rawData.image,
    title: rawData.title
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

export const getHomepageComponents = (localeCode: string): CustomPage => {
  return translateField(rawDataHomepage.data, localeCode).map(homepage => {
    switch (homepage.type) {
      case 'carousel': {
        return getCarouselPageComponent(homepage)
      }

      case 'hero': {
        return getHeroPageComponent(homepage)
      }

      case 'grid': {
        return getGridPageComponent(homepage)
      }
    }
  })
}

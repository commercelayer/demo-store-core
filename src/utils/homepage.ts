import { RawDataCarousel, RawDataGrid, RawDataHero, rawDataHomepage } from '#data/homepage'
import { translateField } from '#i18n/locale'

type Image = {
  src: string
  alt: string
}

type Carousel = {
  type: 'carousel'
  slides: {
    image: Image
    title: string
    description: string
    linkLabel: string
    linkHref: string
  }[]
}

type Hero = {
  type: 'hero'
  image: Image
  title: string
  description: string
  href: string
}

type Grid = {
  type: 'grid'
  items: {
    image: Image
    title: string
    description: string
    linkLabel: string
    linkHref: string
  }[]
}

export type Homepage = (Carousel | Hero | Grid)[]

const getCarousel = (rawData: RawDataCarousel, localeCode: string): Carousel => {
  return {
    type: 'carousel',
    slides: rawData.slides.map(slide => ({
      image: translateField(slide.image, localeCode),
      title: translateField(slide.title, localeCode),
      description: translateField(slide.description, localeCode),
      linkLabel: translateField(slide.linkLabel, localeCode),
      linkHref: translateField(slide.linkHref, localeCode)
    }))
  }
}

const getHero = (rawData: RawDataHero, localeCode: string): Hero => {
  return {
    type: 'hero',
    description: translateField(rawData.description, localeCode),
    href: translateField(rawData.href, localeCode),
    image: translateField(rawData.image, localeCode),
    title: translateField(rawData.title, localeCode)
  }
}

const getGrid = (rawData: RawDataGrid, localeCode: string): Grid => {
  return {
    type: 'grid',
    items: rawData.items.map(item => ({
      image: translateField(item.image, localeCode),
      title: translateField(item.title, localeCode),
      description: translateField(item.description, localeCode),
      linkLabel: translateField(item.linkLabel, localeCode),
      linkHref: translateField(item.linkHref, localeCode)
    }))
  }
}

export const getHomepage = (localeCode: string): Homepage => {
  return rawDataHomepage.data.map(homepage => {
    switch (homepage.type) {
      case 'carousel': {
        return getCarousel(homepage, localeCode)
      }

      case 'hero': {
        return getHero(homepage, localeCode)
      }

      case 'grid': {
        return getGrid(homepage, localeCode)
      }
    }
  })
}

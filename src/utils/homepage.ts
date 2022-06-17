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
  description: string | null
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

const getCarousel = (rawData: RawDataCarousel): Carousel => {
  return {
    type: 'carousel',
    slides: rawData.slides.map(slide => ({
      image: slide.image,
      title: slide.title,
      description: slide.description,
      linkLabel: slide.linkLabel,
      linkHref: slide.linkHref
    }))
  }
}

const getHero = (rawData: RawDataHero): Hero => {
  return {
    type: 'hero',
    description: rawData.description || null,
    href: rawData.href,
    image: rawData.image,
    title: rawData.title
  }
}

const getGrid = (rawData: RawDataGrid): Grid => {
  return {
    type: 'grid',
    items: rawData.items.map(item => ({
      image: item.image,
      title: item.title,
      description: item.description,
      linkLabel: item.linkLabel,
      linkHref: item.linkHref
    }))
  }
}

export const getHomepage = (localeCode: string): Homepage => {
  return translateField(rawDataHomepage.data, localeCode).map(homepage => {
    switch (homepage.type) {
      case 'carousel': {
        return getCarousel(homepage)
      }

      case 'hero': {
        return getHero(homepage)
      }

      case 'grid': {
        return getGrid(homepage)
      }
    }
  })
}

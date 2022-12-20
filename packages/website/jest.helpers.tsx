import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import type { Catalog, Taxon, Taxonomy } from '#data/models/catalog'
import type { ShoppableLocale } from '#i18n/locale'
import type { CarouselPageComponent } from '#utils/pages'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import type { RawDataOrganization } from '@commercelayer/demo-store-types'
import { RouterContext as NextRouterContext } from 'next/dist/shared/lib/router-context'
import type { NextRouter } from 'next/router'

type Props = {
  children: React.ReactNode
  href: string
  locale?: string
  mockedUseRouter: jest.SpyInstance
}

export const RouterContext: React.FC<Props> = ({ children, href, locale, mockedUseRouter }) => {

  mockedUseRouter.mockImplementation(() => createRouter(href, locale))

  return (
    <NextRouterContext.Provider value={createRouter(href, locale)}>
      {children}
    </NextRouterContext.Provider>
  )
}

export const createRouter = (href: string, locale: string = 'en-US'): NextRouter => {
  return {
    basePath: NEXT_PUBLIC_BASE_PATH,
    route: `/[locale]${href}`,
    pathname: `/[locale]${href}`,
    query: {
      locale
    },
    asPath: `/${locale}${href}`,
    isLocaleDomain: false,
    forward: jest.fn(),
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    beforePopState: jest.fn(),
    events: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    },
    isFallback: false,
    isReady: true,
    isPreview: false
  }
}

export const createOrganization = (): RawDataOrganization => {
  return {
    favicon_url: 'https://www.commercelayer.com/favicon.ico',
    logo_url: 'https://www.commercelayer.com/logo.png',
    name: 'Commerce Layer',
    primary_color: '#00a8ff',
  }
}

export const createLocale = (): ShoppableLocale => {
  return {
    code: 'en-US',
    isShoppable: true,
    country: {
      catalog: 'AMER',
      code: 'US',
      name: 'United States',
      languages: ['en'],
      market: 123456789,
      region: 'Americas'
    },
    language: {
      catalog: 'AMER',
      code: 'en',
      name: 'English'
    }
  }
}

export const createCatalog = (id: string, taxonomies: Taxonomy[] = []): Unserializable<Catalog> => {
  return makeUnserializable({
    id: `catalog-key-${id}`,
    name: `catxalog-name-${id}`,
    productDataset: {},
    taxonomies
  })
}

export const createTaxonomy = (id: string, taxons: Taxon[] = []): Taxonomy => {
  return {
    id: `taxonomy-key-${id}`,
    name: `taxonomy-name-${id}`,
    facetKey: `taxonomy-facetKey-${id}`,
    taxons
  }
}

export const createTaxon = (id: string, taxons: Taxon[] = [], references: string[] = []): Taxon => {
  return {
    id: `taxon-key-${id}`,
    name: `taxon-name-${id}`,
    description: `taxon-description-${id}`,
    label: `Label for ${id}`,
    slug: `taxon-slug-${id}`,
    taxons,
    references,
  }
}

export const createCarouselPageComponent = (id: string): CarouselPageComponent => {
  return {
    type: 'carousel',
    id,
    slides: [
      {
        title: `slide-1-title-${id}`,
        description: `slide-1-description-${id}`,
        image: {
          alt: `slide-1-image-alt-${id}`,
          src: `slide-1-image-src-${id}`
        },
        linkHref: `slide-1-linkHref-${id}`,
        linkLabel: `slide-1-linkLabel-${id}`,
      },
      {
        title: `slide-2-title-${id}`,
        description: `slide-2-description-${id}`,
        image: {
          alt: `slide-2-image-alt-${id}`,
          src: `slide-2-image-src-${id}`
        },
        linkHref: `slide-2-linkHref-${id}`,
        linkLabel: `slide-2-linkLabel-${id}`,
      }
    ]
  }
}

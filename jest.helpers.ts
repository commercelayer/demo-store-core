import { basePath } from '#config/general.config'
import type { Catalog, Taxon, Taxonomy } from '#utils/catalog'
import { makeUnserializable } from '#utils/unserializable'
import type { NextRouter } from 'next/router'

export const createRouter = (href: string, locale: string = 'en-US'): NextRouter => {
  return {
    basePath,
    route: '/[locale]${href}',
    pathname: '/[locale]${href}',
    query: {
      locale
    },
    asPath: `/${locale}${href}`,
    isLocaleDomain: false,
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

export const createCatalog = (id: string, taxonomies: Taxonomy[] = []): Catalog => {
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

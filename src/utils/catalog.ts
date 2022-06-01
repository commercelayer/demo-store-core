import type { Catalog, Taxon, Taxonomy } from '#data/catalogs'
import type { DeepFindResult } from '#utils/collection'
import { getSearchUrl } from '#utils/url'
import type { NavigationPath } from '@typings/navigation.d'

const getPrimaryTaxonomy = (catalog: Catalog): Taxonomy => {
  // TODO: taxonomies[0] is a requirement. First taxonomy is considered the navigation one. Should it be configurable?
  return catalog.taxonomies[0]
}

export const getRootNavigationLinks = (catalog: Catalog): NavigationPath => {
  return {
    parent: [],
    current: {
      key: 'home',
      href: '/',
      text: 'Home'
    },
    children: getPrimaryTaxonomy(catalog).taxons.map(taxon => ({
      key: taxon.key,
      href: getSearchUrl(taxon.slug),
      text: taxon.label
    }))
  }
}

export const getNavigationLinks = (taxon: DeepFindResult<Taxon>): NavigationPath => {
  return {
    parent: taxon.memo.map(({ key, slug, label }) => ({
      key: key,
      href: getSearchUrl(slug),
      text: label
    })),
    current: {
      key: taxon.result.key,
      href: getSearchUrl(taxon.result.slug),
      text: taxon.result.label
    },
    children: taxon.result.taxons.map(({ key, slug, label }) => ({
      key: key,
      href: getSearchUrl(slug),
      text: label
    }))
  }
}

export const getSlugs = (catalog: Catalog): string[] => {
  function getFlatSlug(taxon: Taxon): string[] {
    return [taxon.slug].concat(taxon.taxons.flatMap(getFlatSlug))
  }

  return getPrimaryTaxonomy(catalog).taxons.flatMap(getFlatSlug)
}

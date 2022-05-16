import { NavigationPath } from '#components/Navigation.d'
import { Catalog, DeepFindResult, Taxon } from '#data/catalogs'
import { getSearchUrl } from './url'

export const getRootNavigationLinks = (catalog: Catalog): NavigationPath => {
  return {
    parent: [],
    current: {
      key: 'home',
      href: '/',
      text: 'Home'
    },
    children: catalog.taxonomies[0].taxons.map(taxon => ({
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

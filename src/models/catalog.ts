import { NavigationLink } from '#components/Navigation.d'
import { Catalog } from '#data/catalogs'
import { getSearchUrl } from './url'

export const getNavigationLinks = (catalog: Catalog): NavigationLink[] => {
  return catalog.taxonomies[0].taxons.map(taxon => ({
    key: taxon.key,
    href: getSearchUrl(taxon.slug),
    text: taxon.label
  }))
}

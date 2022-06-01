import type { Catalog, Taxon, Taxonomy } from '#data/catalogs'
import type { LocalizedProductWithVariant } from '#utils/products'
import { makeUnserializable } from '#utils/unserializable'

export const createCatalog = (id: string, taxonomies: Taxonomy[] = []): Catalog => {
  return makeUnserializable({
    key: `catalog-key-${id}`,
    name: `catalog-name-${id}`,
    taxonomies
  })
}

export const createTaxonomy = (id: string, taxons: Taxon[] = []): Taxonomy => {
  return makeUnserializable({
    key: `taxonomy-key-${id}`,
    name: `taxonomy-name-${id}`,
    facetKey: `taxonomy-facetKey-${id}`,
    taxons
  })
}

export const createTaxon = (id: string, taxons: Taxon[] = [], products: LocalizedProductWithVariant[] = []): Taxon => {
  return makeUnserializable({
    key: `taxon-key-${id}`,
    name: `taxon-name-${id}`,
    description: `taxon-description-${id}`,
    label: `Label for ${id}`,
    slug: `taxon-slug-${id}`,
    taxons,
    products,
  })
}

import type { Catalog, Taxon, Taxonomy } from '#utils/catalog'
import { makeUnserializable } from '#utils/unserializable'

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

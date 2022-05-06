import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'
import { getProductWithVariants, LocalizedProductWithVariant } from './products'

type JsonCatalog = {
  key: string
  name: string
  taxonomies: string[]
}

type JsonTaxonomy = {
  key: string
  label?: string
  name: string
  taxons: string[]
}

export type Catalog = Omit<JsonCatalog, 'taxonomies'> & {
  taxonomies: Taxonomy[]
}

export type Taxonomy = Omit<JsonTaxonomy, 'taxons'> & {
  taxons: Taxon[]
}

export type Taxon = Omit<JsonTaxon, 'references' | 'taxons'> & {
  references: LocalizedProductWithVariant[]
  taxons?: Taxon[] | null
}

export type JsonTaxon = {
  key: string
  label: string
  description: string
  name: string
  slug: string
  image?: string
  references: string[]
  taxons?: string[]
}

const catalogs: JsonCatalog[] = catalogsJson
const taxonomies: JsonTaxonomy[] = taxonomiesJson
export const taxons: JsonTaxon[] = taxonsJson

export const getCatalog = (name: string, locale: string, fetchProducts = false): Catalog => {
  const catalog = catalogs.find(catalog => catalog.name === name)

  if (!catalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  return resolveCatalog(catalog, locale, fetchProducts)
}

const resolveCatalog = (catalog: JsonCatalog, locale: string, fetchProducts: boolean): Catalog => {
  return {
    ...catalog,
    taxonomies: catalog.taxonomies.map(taxonomyKey => taxonomies.find(taxonomy => taxonomy.key === taxonomyKey)!).map(taxonomy => resolveTaxonomy(taxonomy, locale, fetchProducts))
  }
}

const resolveTaxonomy = (taxonomy: JsonTaxonomy, locale: string, fetchProducts: boolean): Taxonomy => {
  return {
    ...taxonomy,
    taxons: taxonomy.taxons.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!).map(taxon => resolveTaxon(taxon, locale, fetchProducts))
  }
}

const resolveTaxon = (taxon: JsonTaxon, locale: string, fetchProducts: boolean): Taxon => {
  return {
    ...taxon,
    references: fetchProducts ? taxon.references.map(referenceCode => getProductWithVariants(referenceCode, locale)) : [],
    taxons: taxon.taxons?.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!).map(taxon => resolveTaxon(taxon, locale, fetchProducts)) || null
  }
}

// function getCatalogSlugs() {

// }

// function getProductsBySlug(slug: string) {

// }

import { Locale } from '#i18n/locale'
import { deepFind, DeepFindResult } from '#utils/collection'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'
import { getProductWithVariants, LocalizedProduct, LocalizedProductWithVariant } from './products'

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
  products: LocalizedProductWithVariant[]
  taxons: Taxon[]
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

export const getCatalog = (locale: Locale, fetchProducts: boolean = false): Catalog => {
  const name = locale.country?.catalog || locale.language.catalog
  const catalog = catalogs.find(catalog => catalog.name === name)

  if (!catalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  if (fetchProducts) {
    buildProductList(catalog, locale.code)
  }

  return resolveCatalog(catalog, locale.code, fetchProducts)
}

const productList: { [code: LocalizedProduct['code']]: LocalizedProduct } = {}

function flattenReferences(taxon: JsonTaxon): string[] {
  return taxon.references.concat(
    (taxon.taxons || []).map(taxonKey => taxons.find(t => t.key === taxonKey)!).flatMap(flattenReferences)
  )
}

function buildProductList(catalog: JsonCatalog, locale: string): void {
  catalog.taxonomies.forEach(taxonomyKey => {
    const taxonomy = taxonomies.find(taxonomy => taxonomy.key === taxonomyKey)

    if (!taxonomy) {
      throw new Error(`Taxonomy ${ taxonomyKey } not found!`)
    }

    taxonomy.taxons.forEach(taxonKey => buildProductList_taxon(taxonKey, [], taxonomy, locale))
  })
}

function buildProductList_taxon(taxonKey: string, prevTaxons: JsonTaxon[], taxonomy: JsonTaxonomy, locale: string): void {
  const taxon = taxons.find(taxon => taxon.key === taxonKey)

  if (!taxon) {
    throw new Error(`Taxon ${taxonKey} not found!`)
  }

  const products = flattenReferences(taxon).map(ref => getProductWithVariants(ref, locale))

  products.flatMap(p => p.variants).concat(products).forEach(product => {
    productList[product.code] = productList[product.code] || product
    productList[product.code] = {
      ...productList[product.code],
      facets: {
        ...productList[product.code].facets,
        [taxonomy.label!]: uniq([
          ...productList[product.code].facets[taxonomy.label!] || [],
          `${prevTaxons.length > 0 ? prevTaxons.map(t => `${t.label} > `).join('') : ''}${taxon.label}`
        ])
      }
    }
  })

  taxon.taxons?.forEach(taxonKey => buildProductList_taxon(taxonKey, prevTaxons.concat(taxon), taxonomy, locale))
}

const resolveCatalog = (catalog: JsonCatalog, locale: string, fetchProducts: boolean): Catalog => {
  return {
    key: catalog.key,
    name: catalog.name,
    taxonomies: catalog.taxonomies.map(taxonomyKey => taxonomies.find(taxonomy => taxonomy.key === taxonomyKey)!).map(taxonomy => resolveTaxonomy(taxonomy, locale, fetchProducts))
  }
}

const resolveTaxonomy = (taxonomy: JsonTaxonomy, locale: string, fetchProducts: boolean): Taxonomy => {
  return {
    key: taxonomy.key,
    label: taxonomy.label,
    name: taxonomy.name,
    taxons: taxonomy.taxons.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!).map(taxon => resolveTaxon(taxon, locale, fetchProducts))
  }
}

const resolveTaxon = (taxon: JsonTaxon, locale: string, fetchProducts: boolean): Taxon => {
  return {
    key: taxon.key,
    label: taxon.label,
    description: taxon.description,
    name: taxon.name,
    slug: taxon.slug,
    ...(taxon.image ? { image: taxon.image } : {}),
    taxons: taxon.taxons?.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!).map(t => resolveTaxon(t, locale, fetchProducts)) || [],
    products: fetchProducts ? taxon.references.map(referenceCode => {
      return getProductWithVariants(referenceCode, locale, Object.values(productList))
    }) : []
  }
}

export function flattenProductsFromTaxon(taxon: Taxon): LocalizedProductWithVariant[] {
  return uniqBy(
    taxon.products.concat(taxon.taxons?.flatMap(flattenProductsFromTaxon) || []),
    'code'
  )
}

export function flattenProductsFromCatalog(catalog: Catalog): LocalizedProductWithVariant[] {
  return uniqBy(
    catalog.taxonomies.flatMap(({ taxons }) => taxons.flatMap(flattenProductsFromTaxon)),
    'code'
  )
}

export function findTaxonBySlug(catalog: Catalog, slug: string): DeepFindResult<Taxon> {
  const taxon = catalog.taxonomies.reduce((acc, cv) => {
    if (acc) {
      return acc
    }

    return deepFind(cv.taxons, 'taxons', 'slug', slug)
  }, undefined as DeepFindResult<Taxon> | undefined)

  if (!taxon) {
    throw new Error('Cannot find Taxon!')
  }

  return taxon
}

// function getCatalogSlugs() {

// }

// function getProductsBySlug(slug: string) {

// }

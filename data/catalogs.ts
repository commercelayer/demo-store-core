import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'

type RawDataCatalog = {
  key: string
  name: string
  taxonomies: string[]
}

type RawDataTaxonomy = {
  key: string
  facetKey: string
  label?: string
  name: string
  taxons: string[]
}

type RawDataTaxon = {
  key: string
  label: string
  description: string
  name: string
  slug: string
  image?: string
  references: string[]
  taxons?: string[]
}

const rawDataCatalogs: RawDataCatalog[] = catalogsJson
const rawDataTaxonomies: RawDataTaxonomy[] = taxonomiesJson
const rawDataTaxons: RawDataTaxon[] = taxonsJson


// -------------------------------

type ProductDataset = {
  [code: LocalizedProductWithVariant['code']]: LocalizedProductWithVariant
}

// export function createProductDatasetFromCatalog(catalog: RawDataCatalog, locale: string): ProductDataset {

// }



// -------------------------------




import type { RawDataProduct } from '#data/products'
import type { Locale } from '#i18n/locale'
import { deepFind, DeepFindResult } from '#utils/collection'
import type { LocalizedProductWithVariant } from '#utils/products'
import { flattenProductVariants, getProductWithVariants } from '#utils/products'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'

export type Catalog = Omit<RawDataCatalog, 'taxonomies'> & {
  _unserializable: Symbol
  taxonomies: Taxonomy[]
  productDataset: ProductDataset
}

export type Taxonomy = Omit<RawDataTaxonomy, 'taxons'> & {
  _unserializable: Symbol
  taxons: Taxon[]
}

export type Taxon = Omit<RawDataTaxon, 'references' | 'taxons'> & {
  _unserializable: Symbol
  products: LocalizedProductWithVariant[]
  taxons: Taxon[]
}

export const getCatalog = (locale: Locale, rawDataProduct: RawDataProduct[] = []): Catalog => {
  const name = locale.country?.catalog || locale.language.catalog
  const rawDataCatalog = rawDataCatalogs.find(catalog => catalog.name === name)

  if (!rawDataCatalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  const productDataset = buildProductDataset(rawDataCatalog, locale.code, rawDataProduct)

  return resolveCatalog(rawDataCatalog, locale.code, productDataset)
}

function flattenReferences(taxon: RawDataTaxon): string[] {
  return taxon.references.concat(
    (taxon.taxons || []).map(getTaxon).flatMap(flattenReferences)
  )
}

function buildProductDataset(catalog: RawDataCatalog, locale: string, rawDataProducts: RawDataProduct[] = []): ProductDataset {
  if (rawDataProducts.length <= 0) {
    return {}
  }

  const productDataset: ProductDataset = {}

  catalog.taxonomies.forEach(taxonomyKey => {
    const taxonomy = getTaxonomy(taxonomyKey)

    taxonomy.taxons.forEach(taxonKey => buildProductDataset_taxon(taxonKey, [], taxonomy, locale, rawDataProducts))
  })

  function buildProductDataset_taxon(taxonKey: string, prevTaxons: RawDataTaxon[], taxonomy: RawDataTaxonomy, locale: string, rawDataProducts: RawDataProduct[]): void {
    const taxon = getTaxon(taxonKey)

    const products = flattenReferences(taxon).map(ref => getProductWithVariants(ref, locale, rawDataProducts))

    flattenProductVariants(products).forEach(product => {
      productDataset[product.code] = productDataset[product.code] || product
      productDataset[product.code] = {
        ...productDataset[product.code],
        facets: {
          ...productDataset[product.code].facets,
          [taxonomy.label!]: uniq([
            ...productDataset[product.code].facets[taxonomy.label!] || [],
            `${prevTaxons.length > 0 ? prevTaxons.map(t => `${t.label} > `).join('') : ''}${taxon.label}`
          ])
        }
      }
    })

    taxon.taxons?.forEach(taxonKey => buildProductDataset_taxon(taxonKey, prevTaxons.concat(taxon), taxonomy, locale, rawDataProducts))
  }

  return productDataset
}

const getTaxonomy = (taxonomyKey: string): RawDataTaxonomy => {
  const taxonomy = rawDataTaxonomies.find(taxonomy => taxonomy.key === taxonomyKey)

  if (!taxonomy) {
    throw new Error(`Cannot find taxonomy with key ${taxonomyKey}`)
  }

  return taxonomy
}

const getTaxon = (taxonKey: string): RawDataTaxon => {
  const taxon = rawDataTaxons.find(taxon => taxon.key === taxonKey)

  if (!taxon) {
    throw new Error(`Cannot find taxon with key ${taxonKey}`)
  }

  return taxon
}

const resolveCatalog = (catalog: RawDataCatalog, locale: string, productDataset: ProductDataset): Catalog => {
  return {
    _unserializable: Symbol.for('unserializable'),
    key: catalog.key,
    name: catalog.name,
    taxonomies: catalog.taxonomies
      .map(getTaxonomy)
      .map(taxonomy => resolveTaxonomy(taxonomy, locale, Object.values(productDataset))),
    productDataset
  }
}

const resolveTaxonomy = (taxonomy: RawDataTaxonomy, locale: string, productList: LocalizedProductWithVariant[]): Taxonomy => {
  return {
    _unserializable: Symbol.for('unserializable'),
    key: taxonomy.key,
    facetKey: taxonomy.facetKey,
    label: taxonomy.label,
    name: taxonomy.name,
    taxons: taxonomy.taxons
      .map(getTaxon)
      .map(taxon => resolveTaxon(taxon, locale, productList))
  }
}

const resolveTaxon = (taxon: RawDataTaxon, locale: string, productList: LocalizedProductWithVariant[]): Taxon => {
  return {
    _unserializable: Symbol.for('unserializable'),
    key: taxon.key,
    label: taxon.label,
    description: taxon.description,
    name: taxon.name,
    slug: taxon.slug,
    ...(taxon.image ? { image: taxon.image } : {}),
    taxons: taxon.taxons?.map(getTaxon)
      .map(t => resolveTaxon(t, locale, productList)) || [],
    products: productList.length > 0 ? taxon.references.map(referenceCode => {
      return getProductWithVariants(referenceCode, locale, productList)
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

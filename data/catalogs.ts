import { z } from 'zod'
import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'

// ---------------------------------------------------------------------------------------------------

import { Locale, localizedFieldSchema, translateField } from '#i18n/locale'
import { deepFind, DeepFindResult } from '#utils/collection'
import { spreadProductVariants, LocalizedProductWithVariant } from '#utils/products'
import { isDefined } from '#utils/types'
import { makeUnserializable, Unserializable, unserializableSchema } from '#utils/unserializable'
import uniq from 'lodash/uniq'


const catalogSchema = z.object({
  id: z.string(),
  name: z.string(),
  taxonomies: z.string().array()
})

const taxonomySchema = z.object({
  id: z.string(),
  name: z.string(),
  facetKey: z.string(),
  taxons: z.string().array()
})

const taxonSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  slug: z.string(),
  image: z.string().optional(),
  references: z.string().array(),
  taxons: z.string().array().optional()
})

export type RawDataCatalog = z.infer<typeof catalogSchema>
export type RawDataTaxonomy = z.infer<typeof taxonomySchema>
export type RawDataTaxon = z.infer<typeof taxonSchema>

export const rawDataCatalogs = unserializableSchema(catalogSchema.array()).parse({
  data: catalogsJson
})

const rawDataTaxonomies = unserializableSchema(taxonomySchema.array()).parse({
  data: taxonomiesJson
})

const rawDataTaxons = unserializableSchema(taxonSchema.array()).parse({
  data: taxonsJson
})





// -------------------------------

type ProductDataset = {
  [code: LocalizedProductWithVariant['sku']]: LocalizedProductWithVariant
}

// -------------------------------

export type Catalog = Unserializable<Omit<RawDataCatalog, 'taxonomies'> & {
  taxonomies: Taxonomy[]
}>

export type Taxonomy = Omit<RawDataTaxonomy, 'taxons'> & {
  taxons: Taxon[]
}

export type Taxon = Omit<RawDataTaxon, 'label' | 'description' | 'taxons'> & {
  label: string
  description: string
  taxons: Taxon[]
}

const catalogCache: { [locale: string]: Catalog } = {}

export const getCatalog = (locale: Locale) => {

  if (catalogCache[locale.code]) {
    return catalogCache[locale.code]
  }

  const name = locale.isShoppable ? locale.country.catalog : locale.language.catalog
  const rawDataCatalog = rawDataCatalogs.data.find(catalog => catalog.name === name)

  if (!rawDataCatalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  const catalog = resolveCatalog(rawDataCatalog, locale.code, {})

  catalogCache[locale.code] = catalog

  return catalog
}

function flattenReferences(taxon: RawDataTaxon): string[] {
  return taxon.references.concat(
    (taxon.taxons || []).map(getTaxon).flatMap(flattenReferences)
  )
}

export function buildProductDataset(catalog: RawDataCatalog, locale: string, productList: LocalizedProductWithVariant[] = []): ProductDataset {
  if (productList.length <= 0) {
    return {}
  }

  const productDataset: ProductDataset = {}

  catalog.taxonomies.forEach(taxonomyKey => {
    const taxonomy = getTaxonomy(taxonomyKey)

    taxonomy.taxons.forEach(taxonKey => buildProductDataset_taxon(taxonKey, [], taxonomy, locale, productList))
  })

  function buildProductDataset_taxon(taxonKey: string, prevTaxons: RawDataTaxon[], taxonomy: RawDataTaxonomy, locale: string, productList: LocalizedProductWithVariant[]): void {
    const taxon = getTaxon(taxonKey)

    const products = flattenReferences(taxon)
      .map(ref => productList.find(product => product.sku === ref))
      .filter(isDefined)

    spreadProductVariants(products).forEach(product => {
      productDataset[product.sku] = productDataset[product.sku] || product
      productDataset[product.sku] = {
        ...productDataset[product.sku],
        [taxonomy.facetKey]: uniq([
          // @ts-expect-error
          ...(productDataset[product.sku][taxonomy.facetKey] || []),
          `${prevTaxons.length > 0 ? prevTaxons.map(t => `${translateField(t.label, locale)} > `).join('') : ''}${translateField(taxon.label, locale)}`
        ])
      }
    })

    taxon.taxons?.forEach(taxonKey => buildProductDataset_taxon(taxonKey, prevTaxons.concat(taxon), taxonomy, locale, productList))
  }

  return productDataset
}

const getTaxonomy = (taxonomyKey: string): RawDataTaxonomy => {
  const taxonomy = rawDataTaxonomies.data.find(taxonomy => taxonomy.id === taxonomyKey)

  if (!taxonomy) {
    throw new Error(`Cannot find taxonomy with key ${taxonomyKey}`)
  }

  return taxonomy
}

const getTaxon = (taxonKey: string): RawDataTaxon => {
  const taxon = rawDataTaxons.data.find(taxon => taxon.id === taxonKey)

  if (!taxon) {
    throw new Error(`Cannot find taxon with key ${taxonKey}`)
  }

  return taxon
}

const resolveCatalog = (catalog: RawDataCatalog, locale: string, productDataset: ProductDataset): Catalog => {
  return makeUnserializable({
    id: catalog.id,
    name: catalog.name,
    taxonomies: catalog.taxonomies
      .map(getTaxonomy)
      .map(taxonomy => resolveTaxonomy(taxonomy, locale, Object.values(productDataset)))
  })
}

const resolveTaxonomy = (taxonomy: RawDataTaxonomy, locale: string, productList: LocalizedProductWithVariant[]): Taxonomy => {
  return {
    id: taxonomy.id,
    facetKey: taxonomy.facetKey,
    name: taxonomy.name,
    taxons: taxonomy.taxons
      .map(getTaxon)
      .map(taxon => resolveTaxon(taxon, locale, productList))
  }
}

const resolveTaxon = (taxon: RawDataTaxon, locale: string, productList: LocalizedProductWithVariant[]): Taxon => {
  return {
    id: taxon.id,
    label: translateField(taxon.label, locale),
    description: translateField(taxon.description, locale),
    name: taxon.name,
    slug: taxon.slug,
    ...(taxon.image ? { image: taxon.image } : {}),
    taxons: taxon.taxons?.map(getTaxon)
      .map(t => resolveTaxon(t, locale, productList)) || [],
    references: taxon.references
  }
}

export function flattenReferencesFromTaxon(taxon: Taxon): string[] {
  return uniq(
    taxon.references.concat(taxon.taxons?.flatMap(flattenReferencesFromTaxon) || [])
  )
}

export function flattenReferencesFromCatalog(catalog: Catalog): string[] {
  return uniq(
    catalog.data.taxonomies.flatMap(({ taxons }) => taxons.flatMap(flattenReferencesFromTaxon)),
  )
}

export function findTaxonBySlug(catalog: Catalog, slug: string): DeepFindResult<Taxon> {
  const taxon = catalog.data.taxonomies.reduce((acc, cv) => {
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

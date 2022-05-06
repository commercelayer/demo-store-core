import { Locale } from '#i18n/locale'
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

export const getCatalog = (locale: Locale, fetchProducts = false): Catalog => {
  const name = locale.country?.catalog || locale.language.catalog
  const catalog = catalogs.find(catalog => catalog.name === name)

  if (!catalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  return resolveCatalog(catalog, locale.code, fetchProducts)
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
    taxons: taxon.taxons?.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!).map(taxon => resolveTaxon(taxon, locale, fetchProducts)) || []
  }
}

// function getCatalogSlugs() {

// }

// function getProductsBySlug(slug: string) {

// }


type Taxonable<IK extends string, SK extends string> = {
  [iteratorKey in IK | SK]: iteratorKey extends SK ? string : Taxonable<IK, SK>[]
}

export function deepFind<T extends Taxonable<IK, SK>, IK extends string, SK extends string>(items: T[] | undefined | null, iteratorKey: IK, searchKey: SK, searchValue: string): { result: T; memo: T[] } | undefined {
  function internal<T extends Taxonable<IK, SK>, IK extends string, SK extends string>(items: T[] | undefined | null, iteratorKey: IK, searchKey: SK, searchValue: string, memo: T[] = [], depth: number = 0): { result: T; memo: T[] } | undefined {
    if (!items) {
      return
    }

    for (const item of items) {

      memo[depth] = item

      if (item[searchKey] === searchValue) {
        return {
          result: item,
          memo: memo // .slice(0, -1)
        }
      }

      const children = item[iteratorKey]

      if (Array.isArray(children)) {
        const child = internal(children, iteratorKey, searchKey, searchValue, memo, depth + 1)

        if (child) {
          return {
            result: child.result,
            memo: child.memo
          }
        }
      }
    }
  }

  return internal(items, iteratorKey, searchKey, searchValue)
}

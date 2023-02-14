import { getRawDataCatalogs } from '#data/catalogs'
import { getRawDataTaxonomies } from '#data/taxonomies'
import { getRawDataTaxons } from '#data/taxons'
import type { Locale } from '#i18n/locale'
import { translateField } from '#utils/locale'
import { LocalizedProductWithVariant, spreadProductVariants } from '#utils/products'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { isNotNullish } from '#utils/utility-types'
import type { RawDataCatalog, RawDataTaxon, RawDataTaxonomy } from '@commercelayer/demo-store-types'
import { memoize } from '#utils/memoize'
import uniq from 'lodash/uniq'

export type Catalog = Omit<RawDataCatalog, 'taxonomies'> & {
  taxonomies: Taxonomy[]
}

export type Taxonomy = Omit<RawDataTaxonomy, 'taxons'> & {
  taxons: Taxon[]
}

export type Taxon = Omit<RawDataTaxon, 'label' | 'description' | 'taxons'> & {
  label: string
  description: string
  taxons: Taxon[]
}

export const getCatalog = memoize(
  async (locale: Locale): Promise<Unserializable<Catalog>> => {
    const name = locale.country?.catalog || locale.language.catalog
    const rawDataCatalog = (await getRawDataCatalogs()).value.find(catalog => catalog.name === name)

    if (!rawDataCatalog) {
      throw new Error(`Cannot find the catalog with name "${name}"`)
    }

    return resolveCatalog(rawDataCatalog, locale.code, {})
  },
  locale => locale.code
)

const resolveCatalog = async (catalog: RawDataCatalog, locale: string, productDataset: ProductDataset): Promise<Unserializable<Catalog>> => {
  const taxonomies = await Promise.all(
    catalog.taxonomies
      .map(async taxonomy => resolveTaxonomy(await getTaxonomy(taxonomy), locale, Object.values(productDataset)))
  )

  return makeUnserializable({
    id: catalog.id,
    name: catalog.name,
    taxonomies
  })
}

const getTaxonomy = memoize(
  async (id: string): Promise<RawDataTaxonomy> => {
    const taxonomy = (await getRawDataTaxonomies()).value.find(taxonomy => taxonomy.id === id)

    if (!taxonomy) {
      throw new Error(`Cannot find taxonomy with id ${id}`)
    }

    return taxonomy
  }
)

const resolveTaxonomy = async (taxonomy: RawDataTaxonomy, locale: string, productList: LocalizedProductWithVariant[]): Promise<Taxonomy> => {
  const taxons = await Promise.all(
    taxonomy.taxons
      .map(async taxon => resolveTaxon(await getTaxon(taxon), locale, productList))
  )

  return {
    id: taxonomy.id,
    facetKey: taxonomy.facetKey,
    name: taxonomy.name,
    taxons
  }
}

const getTaxon = memoize(
  async (id: string): Promise<RawDataTaxon> => {
    const taxon = (await getRawDataTaxons()).value.find(taxon => taxon.id === id)

    if (!taxon) {
      throw new Error(`Cannot find taxon with id ${id}`)
    }

    return taxon
  }
)

const resolveTaxon = async (taxon: RawDataTaxon, locale: string, productList: LocalizedProductWithVariant[]): Promise<Taxon> => {
  return {
    id: taxon.id,
    label: translateField(taxon, 'label', locale),
    description: translateField(taxon, 'description', locale),
    name: taxon.name,
    slug: taxon.slug,
    taxons: await Promise.all(
      taxon.taxons?.map(async taxon => resolveTaxon(await getTaxon(taxon), locale, productList)) || []
    ),
    references: taxon.references
  }
}


// --------------------------------------------------------------------------------------------------------------------

type ProductDataset = {
  [code: LocalizedProductWithVariant['sku']]: LocalizedProductWithVariant
}

export async function buildProductDataset(catalog: RawDataCatalog, locale: string, productList: LocalizedProductWithVariant[] = []): Promise<ProductDataset> {
  if (productList.length <= 0) {
    return {}
  }

  const productDataset: ProductDataset = {}

  for (const taxonomyKey of catalog.taxonomies) {
    const taxonomy = await getTaxonomy(taxonomyKey)

    for (const taxonKey of taxonomy.taxons) {
      await buildProductDataset_taxon(taxonKey, [], taxonomy, locale, productList)
    }
  }

  async function buildProductDataset_taxon(taxonKey: string, prevTaxons: RawDataTaxon[], taxonomy: RawDataTaxonomy, locale: string, productList: LocalizedProductWithVariant[]): Promise<void> {
    const taxon = await getTaxon(taxonKey)

    const products = (await flattenReferences(taxon))
      .map(ref => productList.find(product => product.sku === ref))
      .filter(isNotNullish)

    spreadProductVariants(products).forEach(product => {
      productDataset[product.sku] = productDataset[product.sku] || product
      productDataset[product.sku] = {
        ...productDataset[product.sku],
        [taxonomy.facetKey]: uniq([
          // @ts-expect-error
          ...(productDataset[product.sku][taxonomy.facetKey] || []),
          `${prevTaxons.length > 0 ? prevTaxons.map(t => `${translateField(t, 'label', locale)} > `).join('') : ''}${translateField(taxon, 'label', locale)}`
        ])
      }
    })

    taxon.taxons?.forEach(taxonKey => buildProductDataset_taxon(taxonKey, prevTaxons.concat(taxon), taxonomy, locale, productList))
  }

  return productDataset
}

async function flattenReferences(taxon: RawDataTaxon): Promise<string[]> {
  const subReferences = (await Promise.all(
    (taxon.taxons || []).flatMap(
      async taxonKey => {
        const taxon = await getTaxon(taxonKey)
        return await flattenReferences(taxon)
      }
    )
  )).flat()

  return taxon.references.concat(subReferences)
}

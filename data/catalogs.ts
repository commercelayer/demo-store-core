import catalogsJson from './json/catalogs.json'
import taxonomiesJson from './json/taxonomies.json'
import taxonsJson from './json/taxons.json'

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

export type Taxon = {
  key: string
  label: string
  description: string
  name: string
  slug: string
  image: string
  references: string[]
}

const catalogs: JsonCatalog[] = catalogsJson
const taxonomies: JsonTaxonomy[] = taxonomiesJson
const taxons: Taxon[] = taxonsJson

const resolveCatalogs = (): Catalog[] => {
  const resolvedTaxonomies = resolveTaxonomies()
  return catalogs.map(catalog => {
    return {
      ...catalog,
      taxonomies: catalog.taxonomies.map(taxonomyKey => resolvedTaxonomies.find(taxonomy => taxonomy.key === taxonomyKey)!)
    }
  })
}

const resolveTaxonomies = (): Taxonomy[] => {
  return taxonomies.map(taxonomy => {
    return {
      ...taxonomy,
      taxons: taxonomy.taxons.map(taxonKey => taxons.find(taxon => taxon.key === taxonKey)!)
    }
  })
}

export const getCatalog = (name: string): Catalog => {
  const catalog = resolveCatalogs().find(catalog => catalog.name === name)

  if (!catalog) {
    throw new Error(`Cannot find the catalog with name "${name}"`)
  }

  return catalog
}
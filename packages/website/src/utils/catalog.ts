import type { Catalog, Taxon, Taxonomy } from '#data/models/catalog'
import { deepFind, DeepFindResult } from '#utils/collection'
import { getSearchUrl } from '#utils/url'
import uniq from 'lodash/uniq'
import type { Unserializable } from './unserializable'

export type NavigationLink = {
  key: string
  href: string
  text: string
  description: string
  children?: NavigationLink[]
}

export type Breadcrumbs = {
  parent: NavigationLink[]
  current: NavigationLink
  children: NavigationLink[]
}

export type Navigation = {
  current: NavigationLink
  path: NavigationLink[]
}


const getPrimaryTaxonomy = (catalog: Unserializable<Catalog>): Taxonomy => {
  // TODO: taxonomies[0] is a requirement. First taxonomy is considered the navigation one. Should it be configurable?
  return catalog.value.taxonomies[0]
}

export const getRootNavigationLinks = (catalog: Unserializable<Catalog>): NavigationLink[] => {
  return getPrimaryTaxonomy(catalog).taxons.map(taxon => ({
    key: taxon.id,
    href: getSearchUrl(taxon),
    text: taxon.label,
    description: taxon.description
  }))
}

export const getBreadcrumbs = (taxon: DeepFindResult<Taxon>): Breadcrumbs => {
  return {
    parent: taxon.memo.map(({ id: key, slug, label, description }) => ({
      key: key,
      href: getSearchUrl({slug}),
      text: label,
      description
    })),
    current: {
      key: taxon.result.id,
      href: getSearchUrl(taxon.result),
      text: taxon.result.label,
      description: taxon.result.description
    },
    children: taxon.result.taxons.map(({ id: key, slug, label, description }) => ({
      key: key,
      href: getSearchUrl({slug}),
      text: label,
      description
    }))
  }
}

const getNavigationChildren = (foundTaxon: DeepFindResult<Taxon>, index: number, currentTaxon: Taxon): NavigationLink[] => {
  return foundTaxon.memo[index]?.id === currentTaxon.id ? currentTaxon.taxons.filter(t => flattenReferencesFromTaxon(t).length > 0).map((taxon) => ({
    key: taxon.id,
    href: getSearchUrl({ slug: taxon.slug }),
    text: taxon.label,
    description: taxon.description,
    children: getNavigationChildren(foundTaxon, ++index, taxon)
  })) : []
}

export const getNavigation = (foundTaxon: DeepFindResult<Taxon>): Navigation => {
  return {
    current: {
      key: foundTaxon.result.id,
      href: getSearchUrl(foundTaxon.result),
      text: foundTaxon.result.label,
      description: foundTaxon.result.description
    },
    path: [{
      key: foundTaxon.memo[0].id,
      href: getSearchUrl(foundTaxon.memo[0]),
      text: foundTaxon.memo[0].label,
      description: foundTaxon.memo[0].description,
      children: getNavigationChildren(foundTaxon, 0, foundTaxon.memo[0])
    }]
  }
}

export const getSlugs = (catalog: Unserializable<Catalog>): string[] => {
  function getFlatSlug(taxon: Taxon): string[] {
    return [taxon.slug].concat(taxon.taxons.flatMap(getFlatSlug))
  }

  return getPrimaryTaxonomy(catalog).taxons.flatMap(getFlatSlug)
}

export function flattenReferencesFromTaxon(taxon: Taxon): string[] {
  return uniq(
    taxon.references.concat(taxon.taxons?.flatMap(flattenReferencesFromTaxon) || [])
  )
}

export function flattenReferencesFromCatalog(catalog: Unserializable<Catalog>): string[] {
  return uniq(
    catalog.value.taxonomies.flatMap(({ taxons }) => taxons.flatMap(flattenReferencesFromTaxon)),
  )
}

export function findTaxonBySlug(catalog: Unserializable<Catalog>, slug: string): DeepFindResult<Taxon> {
  const taxon = catalog.value.taxonomies.reduce((acc, cv) => {
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

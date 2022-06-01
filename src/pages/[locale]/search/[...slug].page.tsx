import { findTaxonBySlug, flattenProductsFromTaxon, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getNavigationLinks, getRootNavigationLinks, getSlugs } from '#utils/catalog'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { Props, SearchPageComponent } from './SearchPageComponent'

type Query = {
  locale: string
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(localeCode => {
    const locale = getLocale(localeCode)
    const catalog = getCatalog(locale)
    const slugs = getSlugs(catalog)

    return {
      fallback: false,
      paths: slugs.map(slug => ({
        params: {
          slug: slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale, rawDataProducts)

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const products = flattenProductsFromTaxon(taxon.result)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigationLinks(taxon),
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchPageComponent

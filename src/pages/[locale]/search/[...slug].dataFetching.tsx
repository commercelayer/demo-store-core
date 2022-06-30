import { findTaxonBySlug, flattenReferencesFromTaxon, getCatalog, getNavigation } from '#utils/catalog'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks, getSlugs } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './SearchPageComponent'

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
          slug: slug.replace(/^\//, '').split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  const taxon = findTaxonBySlug(catalog, `/${slug.join('/') }`)

  const references = flattenReferencesFromTaxon(taxon.result)
  const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigation(taxon),
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({ params })
}

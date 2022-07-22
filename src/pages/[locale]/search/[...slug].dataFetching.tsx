import { findTaxonBySlug, flattenReferencesFromTaxon, getCatalog, getNavigation } from '#utils/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks, getSlugs } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './SearchPageComponent'
import { serverSideSettings } from '#contexts/SettingsContext'

type Query = {
  locale: string
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {
    const locale = await getLocale(localeCode)
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
  const locale = await getLocale(localeCode)
  const catalog = getCatalog(locale)

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const references = flattenReferencesFromTaxon(taxon.result)

  const rawDataProducts = await getRawDataProducts()
  const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigation(taxon),
      products,
      ...(await serverSideSettings(localeCode)),
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

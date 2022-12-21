import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale, getLocaleCodes } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { findTaxonBySlug, flattenReferencesFromTaxon, getNavigation, getRootNavigationLinks, getSlugs } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './SearchPageComponent'

type Query = {
  locale: string
  slug: string[]
  page?: string
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {
    const locale = await getLocale(localeCode)
    const catalog = await getCatalog(locale)
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
  const { locale: localeCode, slug, page } = params!
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const localeCodes = await getLocaleCodes()

  console.log('params', params)

  const itemsPerPage = 12

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const references = flattenReferencesFromTaxon(taxon.result)
  const pagedReferences = page ? references.slice(parseInt(page) * itemsPerPage, parseInt(page) * itemsPerPage + itemsPerPage) : references

  const rawDataProducts = await getRawDataProducts()

  const products = pagedReferences.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigation(taxon),
      localeCodes,
      products,
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params, query }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const page = typeof query.page === 'string' && !Number.isNaN(parseInt(query.page)) ? query.page : '0'

  return getStaticProps({ params: { ...params!, page } })
}

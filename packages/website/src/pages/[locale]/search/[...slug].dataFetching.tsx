import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale, getLocaleCodes } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { findTaxonBySlug, flattenReferencesFromTaxon, getNavigation, getRootNavigationLinks, getSlugs } from '#utils/catalog'
import { getProduct, LocalizedProductWithVariant } from '#utils/products'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './SearchPageComponent'

type Query = {
  locale: string
  slug: string[]
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
  const { locale: localeCode, slug } = params!
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const localeCodes = await getLocaleCodes()

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const references = flattenReferencesFromTaxon(taxon.result)

  const rawDataProducts = await getRawDataProducts()

  const products: LocalizedProductWithVariant[] = references.map(ref => {
    const product = getProduct(ref, locale.code, rawDataProducts)

    return {
      ...product,
      images: product.images.slice(0, 1),
      variants: [],
      details: [],
      variant: []
    }
  })

  const result = {
    props: {
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigation(taxon),
      products,
      localeCodes,
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }

  return result
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({ params })
}

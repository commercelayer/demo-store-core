import { flattenReferencesFromCatalog } from '#utils/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale, getLocaleCodes } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { getProductWithVariants, spreadProductVariants } from '#utils/products'
import { productSlugRegExp } from '#config/general.config'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './ProductPageComponent'
import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'

type Query = {
  locale: string
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {
    const locale = await getLocale(localeCode)
    const catalog = await getCatalog(locale)

    const references = flattenReferencesFromCatalog(catalog)

    const rawDataProducts = await getRawDataProducts()
    const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

    const flattenProducts = spreadProductVariants(products)

    return {
      fallback: false,
      paths: flattenProducts.map(product => ({
        params: {
          slug: product.slug.split('/')
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

  const productSlug = slug.join('/')
  const productCode = productSlug.match(productSlugRegExp)?.groups?.productCode

  if (!productCode) {
    throw new Error(`"productSlugRegExp" is not properly configured. Cannot apply RegExp "${productSlugRegExp}" to the given product slug "${productSlug}"`)
  }

  const rawDataProducts = await getRawDataProducts()

  return {
    props: {
      localeCodes,
      navigation: getRootNavigationLinks(catalog),
      product: getProductWithVariants(productCode, locale.code, rawDataProducts),
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


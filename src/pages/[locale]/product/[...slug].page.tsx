import { flattenProductsFromCatalog, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { flattenProductVariants, getProductWithVariants } from '#utils/products'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { ProductPageComponent, Props } from './ProductPageComponent'

type Query = {
  locale: string
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(localeCode => {
    const locale = getLocale(localeCode)
    const catalog = getCatalog(locale, rawDataProducts)
    const products = flattenProductsFromCatalog(catalog)
    const flattenProducts = flattenProductVariants(products)

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
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),

      // TODO: slug.pop() look like a requirement. show it in the readme or change the way.
      product: getProductWithVariants(slug.pop()!, localeCode, rawDataProducts),

      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default ProductPageComponent

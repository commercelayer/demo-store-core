import { flattenProductsFromCatalog, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { Props, SearchPageComponent } from './SearchPageComponent'

type Query = {
  locale: string
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: [],
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale, rawDataProducts)

  const products = flattenProductsFromCatalog(catalog)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchPageComponent

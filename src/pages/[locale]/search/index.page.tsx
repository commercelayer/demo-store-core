import { flattenReferencesFromCatalog, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { getProductWithVariants } from '#utils/products'
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
  const catalog = await getCatalog(locale)

  const references = flattenReferencesFromCatalog(catalog)
  const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchPageComponent

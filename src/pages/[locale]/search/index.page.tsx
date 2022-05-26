import { Container } from '#components/Container'
import { Facet } from '#components/Facet'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { CatalogProvider, useCatalogContext } from '#contexts/CatalogContext'
import { flattenProductsFromCatalog, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import type { LocalizedProductWithVariant } from '#utils/products'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

type Query = {
  locale: string
}

type Props = HeaderProps & {
  products: LocalizedProductWithVariant[]
}

const ProductList: React.FC = () => {
  const { products } = useCatalogContext()

  return (
    <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
      {
        products.map(product => (
          <ProductCard key={product.code} product={product} />
        ))
      }
    </div>
  )
}

const SearchIndexPage: NextPage<Props> = ({ navigation, products }) => {
  return (
    <Page>
      <Container>
        <Header navigation={navigation} />

        <CatalogProvider products={products}>
          <Facet />

          <h2 className='mt-16 block text-2xl font-semibold text-black'>All Products</h2>

          <ProductList />
        </CatalogProvider>

      </Container>

      <Footer />
    </Page>
  )
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
      products,
      navigation: getRootNavigationLinks(catalog),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchIndexPage

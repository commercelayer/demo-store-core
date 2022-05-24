import { Container } from '#components/Container'
import { Facet } from '#components/Facet'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { flattenProductsFromCatalog, getCatalog } from '#data/catalogs'
import { Facets, flattenProductVariants, getFacets, LocalizedProductWithVariant } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#models/catalog'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { CatalogProvider, useCatalog } from 'src/useCatalog'

type Query = {
  locale: string
}

type Props = HeaderProps & {
  products: LocalizedProductWithVariant[]
  facets: Facets
}

const ProductList: React.FC = () => {
  const { products } = useCatalog()

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

const SearchIndexPage: NextPage<Props> = ({ navigation, products, facets }) => {
  return (
    <Page>
      <Container>
        <Header navigation={navigation} />

        <CatalogProvider products={products} availableFacets={facets}>
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
  const catalog = getCatalog(locale, true)



  const products = flattenProductsFromCatalog(catalog)

  const flattenProducts = flattenProductVariants(products)

  return {
    props: {

      products,
      facets: getFacets(flattenProducts),
      navigation: getRootNavigationLinks(catalog),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchIndexPage

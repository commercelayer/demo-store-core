import { Footer } from '#components/Footer'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { LocalizedProductWithVariant } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { getLocale } from '#i18n/locale'
import { getCatalog } from '#data/catalogs'
import uniqBy from 'lodash/uniqBy'

type Query = {
  locale: string
}

type Props = {
  products: LocalizedProductWithVariant[]
}

const Home: NextPage<Props> = ({ products }) => {
  return (
    <Page>
      <Container>
        <Header />

        <h2 className='mt-16 block text-2xl font-semibold text-black'>All Products</h2>

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            products.map(product => (
              <ProductCard key={product.code} product={product} />
            ))
          }
        </div>
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

  const products = uniqBy(catalog.taxonomies.flatMap(({ taxons }) => taxons.flatMap(({ references }) => references)), 'code')

  return {
    props: {
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default Home

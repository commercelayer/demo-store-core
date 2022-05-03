import { Navigation } from '#components/Navigation'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { getBaseProducts, LocalizedProductWithVariant } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'

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

        <Navigation />

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            products.map(product => (
              <ProductCard key={product.code} product={product} />
            ))
          }
        </div>
      </Container>
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
  const { locale } = params!

  return {
    props: {
      products: getBaseProducts(locale),
      ...(await serverSideTranslations(locale))
    }
  }
}

export default Home

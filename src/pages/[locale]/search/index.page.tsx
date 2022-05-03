import { Navigation } from '#components/Navigation'
import { Link } from '#i18n/Link'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { getBaseProducts, LocalizedProductWithVariant } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'

type Query = {
  locale: string
}

type Props = {
  products: LocalizedProductWithVariant[]
}

const ProductTile: React.FC<{ product: LocalizedProductWithVariant }> = ({ product }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <img src={product.images[0]} alt={product.name} width="60" />
      {product.code.split(/^(\w{8})(\w{6})(\w{6})(\w{4})$/).join(' ')}
      <Link href={`/product/${product.slug}`} >{product.name}</Link>
    </div>
  )
}

const Home: NextPage<Props> = ({ products }) => {
  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        {
          products.map(product => (
            <ProductTile key={product.code} product={product} />
          ))
        }
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

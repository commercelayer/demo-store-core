import { Navigation } from '#components/Navigation'
import { Link } from '#i18n/Link'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { getProductWithVariants, LocalizedProductWithVariant } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { Taxon, taxons } from '#data/catalogs'

type Query = {
  locale: string
  taxon: string[]
}

type Props = {
  params: Query
  taxon: Taxon
}

// TODO: move this in a separate component
const ProductTile: React.FC<{ product: LocalizedProductWithVariant }> = ({ product }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <img src={product.images[0]} alt={product.name} width="60" />
      {product.code.split(/^(\w{8})(\w{6})(\w{6})(\w{4})$/).join(' ')}
      <Link href={`/product/${product.slug}`} >{product.name}</Link>
    </div>
  )
}

const Home: NextPage<Props> = ({ taxon, params }) => {
  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        {
          taxon.references.map(code => {
            // TODO: move this to catalog.ts as helper method
            const product = getProductWithVariants(code, params.locale)
            return (
              <ProductTile key={product.code} product={product} />
            )
          })
        }
      </Container>
    </Page>
  )
}

// TODO: We should not generate all taxons for all locales, taxons are specific for each locale.
// TODO: `withLocalePaths` should accepts a method -- withLocalePaths((locale) => ...)
export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: taxons.map(taxon => ({
      params: {
        taxon: taxon.slug.split('/')
      }
    })),
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale } = params!

  return {
    props: {
      params: params!,
      taxon: taxons.find(taxon => taxon.slug === params!.taxon.join('/'))!,
      ...(await serverSideTranslations(locale))
    }
  }
}

export default Home

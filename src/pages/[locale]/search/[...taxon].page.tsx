import { Navigation } from '#components/Navigation'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { getProductWithVariants } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { Taxon, taxons } from '#data/catalogs'
import { ProductCard } from '#components/ProductCard'

type Query = {
  locale: string
  taxon: string[]
}

type Props = {
  params: Query
  taxon: Taxon
}

const Home: NextPage<Props> = ({ taxon, params }) => {
  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            taxon.references.map(code => {
              // TODO: move this to catalog.ts as helper method
              const product = getProductWithVariants(code, params.locale)
              return (
                <ProductCard key={product.code} product={product} />
              )
            })
          }
        </div>
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

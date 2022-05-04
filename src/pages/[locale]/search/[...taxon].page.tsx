import { Navigation } from '#components/Navigation'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { getProductWithVariants } from '#data/products'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { getCatalog, Taxon } from '#data/catalogs'
import { ProductCard } from '#components/ProductCard'
import { getLocale } from '#i18n/locale'

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

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths((localeCode) => {
    const locale = getLocale(localeCode)

    if (!locale) {
      throw new Error('Locale is undefined!')
    }

    const catalog = getCatalog(locale?.country?.catalog || locale?.language.catalog)

    const slugs = catalog.taxonomies.flatMap(taxonomy => taxonomy.taxons.map(taxon => taxon.slug))

    return {
      fallback: false,
      paths: slugs.map(slug => ({
        params: {
          taxon: slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, taxon } = params!

  const locale = getLocale(localeCode)

  if (!locale) {
    throw new Error('Locale is undefined!')
  }

  const catalog = getCatalog(locale?.country?.catalog || locale?.language.catalog)

  const taxonomy = catalog.taxonomies.find(taxonomy => taxonomy.taxons.find(({ slug }) => slug === taxon.join('/')))
  const ttaxon = taxonomy?.taxons.find(({ slug }) => slug === taxon.join('/'))

  return {
    props: {
      params: params!,
      taxon: ttaxon!,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default Home

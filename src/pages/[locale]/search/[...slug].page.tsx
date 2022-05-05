import { Navigation } from '#components/Navigation'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { getCatalog, Taxon } from '#data/catalogs'
import { ProductCard } from '#components/ProductCard'
import { getLocale } from '#i18n/locale'

type Query = {
  locale: string
  slug: string[]
}

type Props = {
  params: Query
  taxon: Taxon
}

const Home: NextPage<Props> = ({ taxon }) => {
  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            taxon.references.map(product => (
              <ProductCard key={product.code} product={product} />
            ))
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

    const catalog = getCatalog(locale?.country?.catalog || locale?.language.catalog, localeCode, false)

    const slugs = catalog.taxonomies.flatMap(taxonomy => taxonomy.taxons.map(taxon => taxon.slug))

    return {
      fallback: false,
      paths: slugs.map(slug => ({
        params: {
          slug: slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!

  const locale = getLocale(localeCode)

  if (!locale) {
    throw new Error('Locale is undefined!')
  }

  const catalog = getCatalog(locale?.country?.catalog || locale?.language.catalog, localeCode, true)

  const taxonomy = catalog.taxonomies.find(taxonomy => taxonomy.taxons.find(taxon => taxon.slug === slug.join('/')))
  const taxon = taxonomy?.taxons.find(taxon => taxon.slug === slug.join('/'))

  return {
    props: {
      params: params!,
      taxon: taxon!,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default Home

import { Navigation } from '#components/Navigation'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { deepFind, getCatalog, Taxon } from '#data/catalogs'
import { ProductCard } from '#components/ProductCard'
import { getLocale } from '#i18n/locale'
import { uniqBy } from 'lodash'
import { LocalizedProductWithVariant } from '#data/products'
import { Link } from '#i18n/Link'

type Query = {
  locale: string
  slug: string[]
}

type Props = {
  params: Query
  taxon: { result: Taxon; memo: Taxon[] }
  products: LocalizedProductWithVariant[]
}

const Home: NextPage<Props> = ({ products, taxon }) => {
  return (
    <Page>
      <Container>
        <Header />

        <Navigation />

        <h2 className='mt-16 block text-2xl font-semibold text-black'>{taxon.result.label}</h2>

        <div>
          {console.log(taxon.memo)}
          {
            taxon.memo.map(taxon => (
              <Link key={taxon.key} href={`/search/${taxon.slug}`}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{taxon.label}</a></Link>
            ))
          }
        </div>

        <div>
          {
            taxon.result.taxons?.map(taxon => {
              return (
                <Link key={taxon.key} href={`/search/${taxon.slug}`}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{taxon.label}</a></Link>
              )
            })
          }
        </div>

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
  return withLocalePaths((localeCode) => {
    const locale = getLocale(localeCode)

    if (!locale) {
      throw new Error('Locale is undefined!')
    }

    const catalog = getCatalog(locale?.country?.catalog || locale?.language.catalog, localeCode, false)

    const slugs = catalog.taxonomies.flatMap(taxonomy => taxonomy.taxons.flatMap(getFlatSlug))

    function getFlatSlug(taxon: Taxon): string[] {
      return [taxon.slug].concat(taxon.taxons?.flatMap(getFlatSlug) || [])
    }

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

  const taxon = catalog.taxonomies.reduce((acc, cv) => {
    if (acc) {
      return acc
    }

    return deepFind(cv.taxons, 'taxons', 'slug', slug.join('/'))
  }, undefined as { result: Taxon; memo: Taxon[] } | undefined)

  if (!taxon) {
    throw new Error('Cannot find Taxon!')
  }

  const products = uniqBy(getFlatProducts(taxon.result), 'code')

  function getFlatProducts(taxon: Taxon): LocalizedProductWithVariant[] {
    return taxon.references.concat(taxon.taxons?.flatMap(getFlatProducts) || [])
  }

  return {
    props: {
      params: params!,
      taxon: taxon!,
      products,
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default Home

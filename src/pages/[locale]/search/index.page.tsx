import { Container } from '#components/Container'
import { Footer } from '#components/Footer'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { Search } from '#components/Search'
import { getCatalog } from '#data/catalogs'
import { Facets, flattenProductVariants, getFacets, LocalizedProductWithVariant } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import uniqBy from 'lodash/uniqBy'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useState } from 'react'

type Query = {
  locale: string
}

type Props = {
  products: LocalizedProductWithVariant[]
  facets: Facets
}

const SearchIndex: NextPage<Props> = ({ products, facets }) => {
  const [result, setResult] = useState<LocalizedProductWithVariant[]>(products)

  return (
    <Page>
      <Container>
        <Header />

        <Search products={products} facets={facets} onChange={setResult} />

        <h2 className='mt-16 block text-2xl font-semibold text-black'>All Products</h2>

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            result.map(product => (
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

  const flattenProducts = flattenProductVariants(products)

  return {
    props: {
      products,
      facets: getFacets(flattenProducts),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default SearchIndex

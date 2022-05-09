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

import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { MagnifyingGlass } from '#assets/icons'

const options: Fuse.IFuseOptions<LocalizedProductWithVariant> = {
  threshold: .4,
  keys: [
    "name",
    "description"
  ]
};

type Query = {
  locale: string
}

type Props = {
  products: LocalizedProductWithVariant[]
}

const Home: NextPage<Props> = ({ products }) => {
  const [result, setResult] = useState<Fuse.FuseResult<LocalizedProductWithVariant>[]>()
  const [searchText, setSearchText] = useState<string>()

  useEffect(function () {
    const fuse = new Fuse(products, options)
    const pattern = searchText
    setResult(pattern ? fuse.search(pattern) : products.map((item, refIndex) => ({ item, refIndex })))
  }, [products, searchText])

  return (
    <Page>
      <Container>
        <Header />

        <label htmlFor="email" className="relative py-3 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block">
          <MagnifyingGlass className="pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3" />
          <input onChange={(event) => setSearchText(event.currentTarget.value)} value={searchText} placeholder="search" className="form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline" />
        </label>

        <h2 className='mt-16 block text-2xl font-semibold text-black'>All Products</h2>

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            (result || []).map(product => (
              <ProductCard key={product.item.code} product={product.item} />
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

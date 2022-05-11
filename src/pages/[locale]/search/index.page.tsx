import { MagnifyingGlass } from '#assets/icons'
import { Container } from '#components/Container'
import { Footer } from '#components/Footer'
import { Header } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { getCatalog } from '#data/catalogs'
import { Facets, flattenProductVariants, getVariantFacets, LocalizedProductWithVariant } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'



const options: Fuse.IFuseOptions<LocalizedProductWithVariant> = {
  useExtendedSearch: true,
  threshold: .3,
  keys: [
    "name",
    "description",

    // TODO: dynamically generate them
    { name: '_facet.color', getFn: (obj) => obj.variant.find(v => v.name === 'color')?.value!  },
    { name: '_facet.size', getFn: (obj) => obj.variant.find(v => v.name === 'size')?.value!  },
  ]
};

type Query = {
  locale: string
}

type Props = {
  products: LocalizedProductWithVariant[]
  facets: Facets
}

const Home: NextPage<Props> = ({ products, facets }) => {
  const [result, setResult] = useState<LocalizedProductWithVariant[]>(products)
  const [searchText, setSearchText] = useState<string>()
  const [colorFacet, setColorFacet] = useState<string[]>([])
  const [sizeFacet, setSizeFacet] = useState<string[]>([])

  useEffect(function () {
    const fuse = new Fuse(flattenProductVariants(products), options)
    const pattern = searchText

    const andExpression: Fuse.Expression[] = []

    if (colorFacet.length > 0) {
      andExpression.push({
        $or: colorFacet.map(value => ({ $path: '_facet.color', $val: `="${value}"` }))
      })
    }

    if (sizeFacet.length > 0) {
      andExpression.push({
        $or: sizeFacet.map(value => ({ $path: '_facet.size', $val: `="${value}"` }))
      })
    }

    if (pattern) {
      andExpression.push({
        $or: [
          { $path: 'name', $val: pattern },
          { $path: 'description', $val: pattern },
        ]
      })
    }

    if (andExpression.length > 0) {
      setResult(
        uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
      )
    }
  }, [products, searchText, colorFacet, sizeFacet])

  return (
    <Page>
      <Container>
        <Header />

        <label htmlFor="email" className="relative py-3 rounded bg-gray-100 text-gray-400 focus-within:text-gray-600 block">
          <MagnifyingGlass className="pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-3" />
          <input onChange={(event) => setSearchText(event.currentTarget.value)} value={searchText} placeholder="search" className="form-input appearance-none bg-transparent w-full pl-14 focus:outline-none focus:shadow-outline" />
        </label>

        {
          Object.entries(facets).map(([facetName, facetValues]) => {
            return (
              <div key={facetName}>
                <div className='font-bold mt-4'>{facetName}</div>
                {
                  facetValues && facetValues.map(currentValue => (
                    <button
                      key={currentValue}
                      className='m-2 bg-gray-100 rounded px-2'
                      onClick={() => (facetName === 'color' ? setColorFacet : setSizeFacet)((prevState) => ([ ...prevState, currentValue ]))}
                    >{currentValue}</button>
                  ))
                }
              </div>
            )
          })
        }

        <h2 className='mt-16 block text-2xl font-semibold text-black'>All Products</h2>

        <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
          {
            (result || []).map(product => (
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
      facets: getVariantFacets(flattenProducts),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default Home

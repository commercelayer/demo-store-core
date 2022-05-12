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
import { useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

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
  const [selectedFacets, setSelectedFacets] = useImmer<{ [name: string]: Facets[string] }>({})

  const fuseOptions: Fuse.IFuseOptions<LocalizedProductWithVariant> = useMemo(() => ({
    useExtendedSearch: true,
    threshold: .3,
    keys: [
      "name",
      "description",

      Object.keys(facets).map(facetName => ({
        name: `_facet.${facetName}`,
        getFn: (obj: LocalizedProductWithVariant) => obj.variant.find(v => v.name === facetName)?.value!
      })),
    ].flat()
  }), [facets])

  useEffect(function manageSearch() {

    const fuse = new Fuse(flattenProductVariants(products), fuseOptions)
    const pattern = searchText

    const andExpression: Fuse.Expression[] = []

    Object.entries(selectedFacets).forEach(([facetName, facetValue]) => {
      if (facetValue) {
        andExpression.push({
          $or: facetValue.map(value => ({ $path: `_facet.${facetName}`, $val: `="${value}"` }))
        })
      }
    })

    if (pattern) {
      andExpression.push({
        $or: [
          { $path: 'name', $val: pattern },
          { $path: 'description', $val: pattern },
        ]
      })
    }

    setResult(
      andExpression.length > 0
        ? uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
        : products
    )

  }, [products, searchText, selectedFacets, fuseOptions])

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
                      className={`m-2 ${selectedFacets[facetName]?.includes(currentValue) ? 'bg-gray-400' : 'bg-gray-100'} rounded px-2`}
                      onClick={() => setSelectedFacets((draft) => {
                        draft[facetName] = draft[facetName] || []
                        const facet = draft[facetName] || []
                        if (Array.isArray(facet)) {
                          const index = facet.indexOf(currentValue)
                          index > -1 ? facet.splice(index, 1) : facet.push(currentValue)
  
                          if (facet.length === 0) {
                            delete draft[facetName]
                          }
                        }
                      })}
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

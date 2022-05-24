import { Facets, flattenProductVariants, getProductWithVariants, LocalizedProductWithVariant } from '#data/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import type Fuse from 'fuse.js'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AuthContext from './contexts/AuthContext'

type Context = {
  products: LocalizedProductWithVariant[]
  availableFacets: Facets
  selectedFacets: { [name: string]: Facets[string] }
  selectFacet: (name: string, value: string) => void
}

type Props = Omit<Context, 'selectFacet' | 'selectedFacets'>

const CatalogContext = createContext<Context>({
  products: [],
  availableFacets: {},
  selectedFacets: {},
  selectFacet: () => {}
})

export const useCatalog = () => useContext(CatalogContext)

export const CatalogProvider: React.FC<Props> = ({ children, products: initialProducts, availableFacets: initialFacets }) => {
  const { products: productsWithPrices } = useCommerceLayerPrice(initialProducts)

  const [searchText, setSearchText] = useState<string>('')
  
  const [products, setProducts] = useState<Context['products']>(initialProducts)
  const [availableFacets, setAvailableFacets] = useState<Context['availableFacets']>(initialFacets)
  const [selectedFacets, setSelectedFacets] = useState<Context['selectedFacets']>({})

  const isFiltering = Object.entries(selectedFacets).length > 0

  const router = useRouter()

  const selectFacet = useMemo<Context['selectFacet']>(() => (name: string, value: string) => {
    const facets = { ...selectedFacets }

    facets[name] = facets[name] || []
    const facet = facets[name] || []

    if (Array.isArray(facet)) {
      const index = facet.indexOf(value)
      index > -1 ? facet.splice(index, 1) : facet.push(value)

      if (facet.length === 0) {
        delete facets[name]
      }
    }

    router.push({
      query: {
        ...router.query,
        facets: JSON.stringify(facets)
      }
    }, undefined, { scroll: false, shallow: true })
  }, [selectedFacets, router])

  const productss = useMemo(
    () => isFiltering ? productsWithPrices : initialProducts.map(ps => productsWithPrices.find(cp => cp.code === ps.code)!),
    [isFiltering, productsWithPrices, initialProducts]
  )

  useEffect(function manageOnRouterChange() {
    if (typeof router.query.facets === 'string') {
      try {
        setSelectedFacets(JSON.parse(router.query.facets))
      } catch (e) {
        setSelectedFacets({})

        // TODO: add isValidJson method and remove facets from url if it is not.
        console.error('The query param "facets" is not a stringified JSON.', e)
      }
    } else {
      setSelectedFacets({})
    }

    if (typeof router.query.q === 'string') {
      setSearchText(router.query.q)
    }
  }, [router])

  useEffect(function manageSearch() {

    (async () => {
      const { flattenProductVariants, getFacets } = await import('#data/products')

      const resultFromFreeTextSearch = await freeTextSearch(productss, searchText)

      setAvailableFacets(
        getFacets(flattenProductVariants(resultFromFreeTextSearch))
      )

      const result = await facetSearch(resultFromFreeTextSearch, selectedFacets)

      setProducts(result)
    })()
  }, [searchText, selectedFacets, productss])



  return (
    <CatalogContext.Provider value={{ products, availableFacets, selectedFacets, selectFacet }}>
      {children}
    </CatalogContext.Provider>
  )
};


function useCommerceLayerPrice(initialProducts: LocalizedProductWithVariant[]) {
  const { accessToken, domain, organization } = useContext(AuthContext)

  const [latestInitialProducts, setLatestInitialProducts] = useState(initialProducts)
  const [products, setProducts] = useState(flattenProductVariants(initialProducts))

  const hasChanged = useMemo(
    () => JSON.stringify(latestInitialProducts) !== JSON.stringify(initialProducts),
    [initialProducts, latestInitialProducts]
  )

  useEffect(() => {
    let isMounted = true

    if (!accessToken || !domain || !organization) {
      return
    }

    const client = CommerceLayer({ accessToken, organization, domain })

    mapWithPrice(
      client,
      flattenProductVariants(initialProducts)
    ).then((productsWithPrices) => {
      if (isMounted) {
        setProducts(productsWithPrices.map(product => getProductWithVariants(product.code, product._locale, productsWithPrices)))
        setLatestInitialProducts(initialProducts)
      }
    })

    return () => {
      isMounted = false
    }
  }, [accessToken, domain, organization, initialProducts])

  return {
    products: hasChanged ? initialProducts : products
  }
}

const mapWithPrice = async (client: CommerceLayerClient, products: LocalizedProductWithVariant[]) => {
  const pageSize = 25
  const chunkedSkus = chunk(products, pageSize)

  await Promise.all(
    chunkedSkus.map(async (skus, chunkIndex) => {
      try {
        const prices = await client.prices.list({
          pageSize,
          filters: { sku_code_in: skus.map(p => p.code).join(',') }
        })

        prices.map((price) => {
          const productIndex = chunkedSkus[chunkIndex].findIndex(p => p.code === price.sku_code)

          chunkedSkus[chunkIndex][productIndex].facets = {
            ...chunkedSkus[chunkIndex][productIndex].facets,
            price: [price.formatted_amount!]
          }
        })
      } catch (e) {
        console.error('Cannot fetch prices!')
      }
    })
  )

  return chunkedSkus.flat()
}

async function freeTextSearch(products: LocalizedProductWithVariant[], query: string): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  if (query === '') {
    return products
  }

  const fuse = new Fuse(products, {
    useExtendedSearch: false,
    threshold: .3,
    keys: [
      'name',
      'description',
    ]
  })

  return fuse.search({
    $or: [
      { $path: 'name', $val: query },
      { $path: 'description', $val: query },
    ]
  }).map(r => r.item)
}

async function facetSearch(products: LocalizedProductWithVariant[], facets: { [name: string]: Facets[string] }): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  const andExpression: Fuse.Expression[] = []

  Object.entries(facets).forEach(([facetName, facetValue]) => {
    if (facetValue) {
      andExpression.push({
        $or: facetValue.map(value => ({ $path: `facets.${facetName}`, $val: `="${value}"` }))
      })
    }
  })

  if (andExpression.length <= 0) {
    return products
  }

  const fuse = new Fuse(products, {
    useExtendedSearch: true,
    threshold: .3,
    keys: Object.keys(facets).map(facetName => `facets.${facetName}`)
  })

  return uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
}
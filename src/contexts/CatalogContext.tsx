import type { FacetResult, Primitives } from '#utils/facets'
import type { LocalizedProductWithVariant } from '#utils/products'
import { flattenProductVariants, getProductWithVariants } from '#utils/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import facetsConfig from 'config/facets.config'
import type Fuse from 'fuse.js'
import { uniq } from 'lodash'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuthContext } from './AuthContext'

type SelectedFacets = FacetResult

type Context = {
  products: LocalizedProductWithVariant[]
  availableFacets: FacetResult
  selectedFacets: SelectedFacets
  selectFacet: (name: string, value: Primitives | Primitives[]) => void
  currencyCode?: string
}

type Props = Omit<Context, 'availableFacets' | 'selectedFacets' | 'selectFacet'>

const CatalogContext = createContext<Context>({
  products: [],
  availableFacets: {},
  selectedFacets: {},
  selectFacet: () => { }
})

export const useCatalogContext = () => useContext(CatalogContext)

export const CatalogProvider: React.FC<Props> = ({ children, products: initialProducts }) => {
  const router = useRouter()

  const { products: productsWithAvailabilities } = useCommerceLayerAvailability(initialProducts)
  const { products: productsWithPrices, currencyCode } = useCommerceLayerPrice(productsWithAvailabilities)

  const [query, setQuery] = useState<string>('')

  const [products, setProducts] = useState<Context['products']>(initialProducts)
  const [availableFacets, setAvailableFacets] = useState<Context['availableFacets']>({})
  const [selectedFacets, setSelectedFacets] = useState<Context['selectedFacets']>({})

  const isFiltering = Object.entries(selectedFacets).length > 0

  const productList = useMemo(
    () => isFiltering ? productsWithPrices : initialProducts.map(p => productsWithPrices.find(cp => cp.code === p.code)!),
    [isFiltering, productsWithPrices, initialProducts]
  )

  const selectFacet = useMemo<Context['selectFacet']>(
    () => (name, value) => {
      const facets = { ...selectedFacets }

      facets[name] = facets[name] || []
      const facet = facets[name] || []

      if (Array.isArray(facet)) {
        if (Array.isArray(value)) {
          facets[name] = value
        } else {
          const index = facet.indexOf(value)
          index > -1 ? facet.splice(index, 1) : facet.push(value)
  
          if (facet.length === 0) {
            delete facets[name]
          }
        }
      }

      router.push({
        query: {
          ...router.query,
          facets: JSON.stringify(facets)
        }
      }, undefined, { scroll: false, shallow: true })
    },
    [selectedFacets, router]
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
      setQuery(router.query.q)
    }
  }, [router])

  useEffect(function manageSearch() {
    let isMounted = true

    async function runSearch() {
      const { flattenProductVariants } = await import('#utils/products')
      const { getFacets } = await import('#utils/facets')

      const resultFromFreeTextSearch = await freeTextSearch(productList, query)
      const result = await facetSearch(resultFromFreeTextSearch, selectedFacets)

      if (isMounted) {
        setAvailableFacets(
          getFacets(flattenProductVariants(resultFromFreeTextSearch))
        )

        setProducts(result)
      }
    }

    runSearch().catch(console.error)

    return () => {
      isMounted = false
    }
  }, [query, selectedFacets, productList])

  return (
    <CatalogContext.Provider value={{ products, availableFacets, selectedFacets, selectFacet, currencyCode }}>
      {children}
    </CatalogContext.Provider>
  )
}


function useCommerceLayerAvailability(initialProducts: LocalizedProductWithVariant[]) {
  const { accessToken, domain, organization } = useAuthContext()

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

    mapWithAvailability(
      client,
      flattenProductVariants(initialProducts)
    ).then((productsWithAvailabilities) => {
      if (isMounted) {
        setProducts(productsWithAvailabilities.map(product => getProductWithVariants(product.code, product._locale, productsWithAvailabilities)))
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


function useCommerceLayerPrice(initialProducts: LocalizedProductWithVariant[]) {
  const { accessToken, domain, organization } = useAuthContext()

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
    products: hasChanged ? initialProducts : products,
    currencyCode: products[0].price?.currency_code
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

          chunkedSkus[chunkIndex][productIndex].price = {
            id: price.id,
            amount_cents: price.amount_cents,
            amount_float: price.amount_float,
            compare_at_amount_cents: price.compare_at_amount_cents,
            compare_at_amount_float: price.compare_at_amount_float,
            currency_code: price.currency_code,
            formatted_amount: price.formatted_amount,
            formatted_compare_at_amount: price.formatted_compare_at_amount
          }
        })
      } catch (e) {
        console.error('Cannot fetch prices!')
      }
    })
  )

  return chunkedSkus.flat()
}

const mapWithAvailability = async (client: CommerceLayerClient, products: LocalizedProductWithVariant[]) => {
  const pageSize = 25
  const chunkedSkus = chunk(products, pageSize)

  await Promise.all(
    chunkedSkus.map(async (skus, chunkIndex) => {
      try {
        const availableProducts = await client.skus.list({
          pageSize,
          filters: {
            stock_items_quantity_gt: 0,
            code_in: skus.map(p => p.code).join(',')
          }
        })

        availableProducts.map((product) => {
          const productIndex = chunkedSkus[chunkIndex].findIndex(p => p.code === product.code)
          chunkedSkus[chunkIndex][productIndex].available = true
        })
      } catch (e) {
        console.error('Cannot fetch availabilities!')
      }
    })
  )

  return chunkedSkus.flat()
}

async function freeTextSearch(products: LocalizedProductWithVariant[], query: string): Promise<LocalizedProductWithVariant[]> {

  if (query === '') {
    return products
  }

  const Fuse = (await import('fuse.js')).default

  const fuse = new Fuse(products, {
    useExtendedSearch: false,
    threshold: .3,
    keys: [
      'name',
      'description'
    ]
  })

  return fuse.search(query)
    .map(r => r.item)
}

async function facetSearch(products: LocalizedProductWithVariant[], facets: SelectedFacets): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  const facetsWithRangeType = facetsConfig.filter(c => c.type === 'priceRange').map(c => c.field)
  const isRangeType = (facetName: string) => facetsWithRangeType.includes(facetName)

  const andExpression: Fuse.Expression[] = []

  const availableFacets: FacetResult = {}

  const fuse = new Fuse(products, {
    useExtendedSearch: true,
    threshold: .3,
    getFn: (obj, path) => {
      const value = Fuse.config.getFn(obj, path)

      const pathWithDots = Array.isArray(path) ? path.join('.') : path

      availableFacets[pathWithDots] = availableFacets[pathWithDots] || []
      availableFacets[pathWithDots] = uniq(availableFacets[pathWithDots].concat(value))

      return value
    },
    keys: Object.keys(facets)
  })

  Object.entries(facets).forEach(([facetName, facetValue]) => {
    if (facetValue) {
      if (isRangeType(facetName)) {
        andExpression.push({
          $or: availableFacets[facetName]
            .filter(v => v >= facetValue[0] && v <= facetValue[1])
            .map(value => ({ $path: `${facetName}`, $val: `${value}` }))
        })
      } else {
        andExpression.push({
          $or: facetValue.map(value => ({ $path: `${facetName}`, $val: `${value}` }))
        })
      }
    }
  })

  if (andExpression.length <= 0) {
    return products
  }

  return uniqBy(fuse.search({ $and: andExpression }).map(r => r.item), 'variantCode')
}

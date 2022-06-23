import { buildProductDataset } from '#utils/catalog'
import { getLocale } from '#i18n/locale'
import type { FacetResult, Primitives } from '#utils/facets'
import { getFacets } from '#utils/facets'
import { addProductVariants, spreadProductVariants, LocalizedProductWithVariant } from '#utils/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import facetsConfig from '#config/facets.config'
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

  const flattenProducts = useMemo(() => spreadProductVariants(initialProducts), [initialProducts])

  const { products: productsWithTaxonomies } = useCatalog(flattenProducts)
  const { products: productsWithAvailabilities } = useCommerceLayerAvailability(productsWithTaxonomies)
  const { products: productsWithPrices, currencyCode } = useCommerceLayerPrice(productsWithAvailabilities)

  const [query, setQuery] = useState<string | undefined>(undefined)

  const [products, setProducts] = useState<Context['products']>(initialProducts)
  const [availableFacets, setAvailableFacets] = useState<Context['availableFacets']>({})
  const [selectedFacets, setSelectedFacets] = useState<Context['selectedFacets']>({})

  const isFiltering = Object.entries(selectedFacets).length > 0 || query !== undefined

  const productList = useMemo(
    () => isFiltering ? productsWithPrices : initialProducts.map(p => productsWithPrices.find(cp => cp.sku === p.sku)!),
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
    } else {
      setQuery(undefined)
    }
  }, [router])

  useEffect(function manageSearch() {
    let isMounted = true

    async function runSearch() {
      const resultFromFreeTextSearch = await freeTextSearch(productList, query)
      const result = await facetSearch(resultFromFreeTextSearch, selectedFacets)

      if (isMounted) {
        setAvailableFacets(
          getFacets(spreadProductVariants(resultFromFreeTextSearch))
        )

        setProducts(
          // TODO: this could be a configuration .. group by variantCode vs productCode
          uniqBy(result, 'variantCode')
          // uniqBy(result, 'productCode')
        )
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

function useCatalog(initialProducts: LocalizedProductWithVariant[]) {
  const router = useRouter()

  const [latestInitialProducts, setLatestInitialProducts] = useState(initialProducts)
  const [products, setProducts] = useState(initialProducts)

  const hasChanged = useMemo(
    () => JSON.stringify(latestInitialProducts) !== JSON.stringify(initialProducts),
    [initialProducts, latestInitialProducts]
  )

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      const { rawDataCatalogs } = await import('#data/catalogs')
      console.log('rawDataCatalogs.data.length', rawDataCatalogs.data.length)

      const locale = getLocale(router.query.locale)

      const name = locale.country?.catalog || locale.language.catalog
      const rawDataCatalog = rawDataCatalogs.data.find(catalog => catalog.name === name)

      if (rawDataCatalog) {
        const productDataset = buildProductDataset(rawDataCatalog, locale.code, initialProducts)

        if (isMounted) {
          setProducts(Object.values(productDataset))
          setLatestInitialProducts(initialProducts)
        }
      }
    })()


    return () => {
      isMounted = false
    }
  }, [initialProducts, router.query.locale])

  return {
    products: hasChanged ? initialProducts : products
  }
}

function useCommerceLayerAvailability(initialProducts: LocalizedProductWithVariant[]) {
  const { accessToken, domain, organization } = useAuthContext()

  const [latestInitialProducts, setLatestInitialProducts] = useState(initialProducts)
  const [products, setProducts] = useState(initialProducts)

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
      initialProducts
    ).then((productsWithAvailabilities) => {
      if (isMounted) {
        setProducts(productsWithAvailabilities.map(product => addProductVariants(product, productsWithAvailabilities)))
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
  const [products, setProducts] = useState(initialProducts)

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
      initialProducts
    ).then((productsWithPrices) => {
      if (isMounted) {
        setProducts(productsWithPrices.map(product => addProductVariants(product, productsWithPrices)))
        setLatestInitialProducts(initialProducts)
      }
    })

    return () => {
      isMounted = false
    }
  }, [accessToken, domain, organization, initialProducts])

  return {
    products: hasChanged ? initialProducts : products,
    currencyCode: products[0]?.price?.currency_code
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
          filters: { sku_code_in: skus.map(p => p.sku).join(',') }
        })

        prices.map((price) => {
          const productIndex = chunkedSkus[chunkIndex].findIndex(p => p.sku === price.sku_code)

          chunkedSkus[chunkIndex][productIndex].price = price
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
            code_in: skus.map(p => p.sku).join(',')
          }
        })

        availableProducts.map((product) => {
          const productIndex = chunkedSkus[chunkIndex].findIndex(p => p.sku === product.code)
          chunkedSkus[chunkIndex][productIndex].available = true
        })
      } catch (e) {
        console.error('Cannot fetch availabilities!')
      }
    })
  )

  return chunkedSkus.flat()
}

async function freeTextSearch(products: LocalizedProductWithVariant[], query: string | undefined): Promise<LocalizedProductWithVariant[]> {

  if (!query || query === '') {
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

  const facetsWithRangeType = facetsConfig.filter(c => c.appearance === 'priceRange').map(c => c.field)
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
            .map(value => ({ $path: `${facetName}`, $val: `="${value}"` }))
        })
      } else {
        andExpression.push({
          $or: facetValue.map(value => ({ $path: `${facetName}`, $val: `="${value}"` }))
        })
      }
    }
  })

  if (andExpression.length <= 0) {
    return products
  }

  return fuse.search({ $and: andExpression })
    .map(r => r.item)
}

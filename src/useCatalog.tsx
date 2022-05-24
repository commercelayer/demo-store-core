import { Facets, flattenProductVariants, getProductWithVariants, LocalizedProductWithVariant } from '#data/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AuthContext from './contexts/AuthContext'
import chunk from 'lodash/chunk'
import { useRouter } from 'next/router'

type Context = {
  products: LocalizedProductWithVariant[]
}

const CatalogContext = createContext<Context>({ products: [] })

export const useCatalog = () => useContext(CatalogContext)

export const CatalogProvider: React.FC<Context> = ({ children, products: initialProducts }) => {
  const { products } = useCommerceLayerPrice(initialProducts)

  const [searchText, setSearchText] = useState<string>('')
  const [selectedFacets, setSelectedFacets] = useState<{ [name: string]: Facets[string] }>({})

  const router = useRouter()

  useEffect(function manageOnRouterChange() {
    if (typeof router.query.facets === 'string') {
      try {
        setSelectedFacets(JSON.parse(router.query.facets))
      } catch (e) {
        // TODO: add isValidJson method and remove facets from url if it is not.
        console.error('The query param "facets" is not a stringified JSON.', e)
      }
    }

    if (typeof router.query.q === 'string') {
      setSearchText(router.query.q)
    }
  }, [router])

  useEffect(() => {
    console.log(searchText)
    console.log(selectedFacets)
  }, [searchText, selectedFacets])



  return (
    <CatalogContext.Provider value={{ products }}>
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

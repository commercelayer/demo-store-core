import { flattenProductVariants, getProductWithVariants, LocalizedProductWithVariant } from '#data/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AuthContext from './contexts/AuthContext'
import chunk from 'lodash/chunk'

type Context = {
  products: LocalizedProductWithVariant[]
}

const CatalogContext = createContext<Context>({ products: [] })

export const useCatalog = () => useContext(CatalogContext)

export const CatalogProvider: React.FC<Context> = ({ children, products: initialProducts }) => {
  const { products } = useCommerceLayerPrice(initialProducts)

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

    const products = flattenProductVariants(initialProducts)

    const client = CommerceLayer({ accessToken, organization, domain })

    mapWithPrice(client, products).then((products) => {
      if (isMounted) {
        setProducts(products.map(product => getProductWithVariants(product.code, product._locale, products)))
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

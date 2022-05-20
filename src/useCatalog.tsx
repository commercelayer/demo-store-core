import { flattenProductVariants, getProductWithVariants, LocalizedProduct, LocalizedProductWithVariant } from '#data/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { createContext, Provider, useContext, useEffect, useMemo, useState } from 'react'
import AuthContext from './contexts/AuthContext'
import chunk from 'lodash/chunk'

type ProductList = {
  [code: LocalizedProduct['code']]: LocalizedProductWithVariant
}

export type State = {
  products: ProductList
}

type Context = {
  products: LocalizedProductWithVariant[]
}

const OriginalCatalogContext = createContext<Context>({ products: [] })

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
  
          chunkedSkus[chunkIndex][productIndex].facets ={
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

// @ts-expect-error
const CatalogProvider: Provider<Context> = ({ children, value: initialValue }) => {
  const [latestInitialValue, setLatestInitialValue] = useState(initialValue)
  const [value, setValue] = useState({
    products: flattenProductVariants(initialValue.products)
  })

  const { accessToken, domain, organization } = useContext(AuthContext)

  const hasChanged = useMemo(
    () => JSON.stringify(latestInitialValue) !== JSON.stringify(initialValue),
    [initialValue, latestInitialValue]
  )

  useEffect(() => {
    let isMounted = true

    if (!accessToken || !domain || !organization) {
      return
    }

    const products = [ ...flattenProductVariants(initialValue.products) ]

    const client = CommerceLayer({ accessToken, organization, domain })

    mapWithPrice(client, products).then((products) => {
      if (isMounted) {
        setValue({ products: products.map(p => getProductWithVariants(p.code, p._locale, products)) })
        setLatestInitialValue(initialValue)
      }
    })

    return () => {
      isMounted = false
    }
  }, [accessToken, domain, organization, initialValue])

  return (
    <OriginalCatalogContext.Provider value={hasChanged ? initialValue : value}>
      {children}
    </OriginalCatalogContext.Provider>
  )
};

export const CatalogContext = {
  Consumer: OriginalCatalogContext.Consumer,
  Provider: CatalogProvider
};

export const useCatalogContext = () => {
  return useContext(OriginalCatalogContext) as Context
}

import { flattenProductVariants, LocalizedProduct, LocalizedProductWithVariant } from '#data/products'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { createContext, Provider, useContext, useEffect, useState } from 'react'
import AuthContext from './contexts/AuthContext'

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

const fetchPrice = async (client: CommerceLayerClient, sku: string) => {
  const [ price ] = await client.prices.list({ filters: { sku_code_in: sku } })

  return price
}

// @ts-expect-error
const CatalogProvider: Provider<Context> = ({ children, value: initialValue }) => {
  const [value, setValue] = useState({
    products: flattenProductVariants(initialValue.products)
  })
  const { accessToken, domain, organization } = useContext(AuthContext)

  useEffect(() => {
    let isMounted = true

    if (!accessToken || !domain || !organization) {
      return
    }

    const products = [...flattenProductVariants(initialValue.products)]

    const client = CommerceLayer({ accessToken, organization, domain })

    Promise.all(products.map(async (product, index) => {
      const price = await fetchPrice(client, product.code)
      products[index] = {
        ...products[index],
        facets: {
          ...products[index].facets,
          price: [price.formatted_amount!]
        }
      }
    })).then(() => {
      if (isMounted) {
        setValue({ products })
        // console.log('value', value)
      }
    })

    return () => {
      isMounted = false
    }
  }, [accessToken, domain, organization, initialValue])

  return (
    <OriginalCatalogContext.Provider value={value}>
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

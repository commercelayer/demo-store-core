import type { RawDataProduct } from '#data/products'
import { translateField } from '#i18n/locale'
import uniqBy from 'lodash/uniqBy'

export type LocalizedVariant = Omit<RawDataProduct['variant'][number], 'label'> & {
  label: string
}


export type LocalizedProduct = Omit<RawDataProduct, 'name' | 'description' | 'variant'> & {
  _locale: string
  name: string
  description: string
  variant: LocalizedVariant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}






// type Primitives = number | string | undefined

// type NestedFacet = {
//   [nested: string]: Primitives
// }


// type HierarchyFacet = {
//   [child: string]: Primitives | Primitives[]
// }

// export type AlgoliaFacets = {
//   [name: string]: Primitives | Primitives[] | HierarchyFacet | NestedFacet[]
// }

// type FacetsResult = {
//   [name: string]: {
//     [value: string]: number
//   } | {
//     [value: string]: number
//   }[]
// }

/*
// @ts-ignore
export const getAlgoliaFacets = (products: LocalizedProductWithVariant[]): FacetsResult => {
  return products.reduce((facets, product) => {
    Object.entries(product.facets).map(([facetName, facetValues]) => {
      if (Array.isArray(facetValues)) {
        facetValues.forEach(facetValue => {
          if (facetValue) {
            facets[facetName] = facets[facetName] || {}
            let facet = facets[facetName]
            // @ts-ignore
            facet[facetValue] = facet[facetValue] || 0
            // @ts-ignore
            facet[facetValue]++
          }
        })
      } else {
        if (facetValues) {
          if (typeof facetValues === 'number' || typeof facetValues === 'string') {
            facets[facetName] = facets[facetName] || {}
            let facet = facets[facetName]
            facet[facetValues] = facet[facetValues] || 0
            facet[facetValues]++
          } else {
            // @ts-ignore
            Object.entries(facetValues).forEach(([level, values], index) => {
              facets[facetName] = facets[facetName] || []
              if (Array.isArray(facets[facetName])) {
                // @ts-ignore
                facets[facetName][index] = facets[facetName][index] || {}
                if (Array.isArray(values)) {
                  values.forEach((v) => {
                    // @ts-ignore
                    facets[facetName][index][v] = facets[facetName][index][v] || 0
                    // @ts-ignore
                    facets[facetName][index][v]++
                  })
                } else {
                  // @ts-ignore
                  facets[facetName][index][values] = facets[facetName][index][values] || 0
                  // @ts-ignore
                  facets[facetName][index][values]++
                }
              }
            })
          }
        }
      }
    })

    return facets
  }, {} as FacetsResult)
}
*/


function resolveProductLocale(product: RawDataProduct | LocalizedProduct, locale: string): LocalizedProduct {
  if ('_locale' in product) {
    return product
  }

  return {
    ...product,
    _locale: locale,
    name: translateField(product.name, locale),
    description: translateField(product.description, locale),
    variant: product.variant.map(v => ({
      ...v,
      label: translateField(v.label, locale)
    }))
  }
}

function getProduct(code: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProduct {
  const product = productList.find(product => product.code === code)

  if (!product) {
    throw new Error(`Cannot find a Product with code equal to ${code}`)
  }

  return resolveProductLocale(product, locale)
}

function getProductVariants(product: LocalizedProduct, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProduct[] {
  return productList
    .filter(p => p.productCode === product.productCode)
    .map(p => resolveProductLocale(p, product._locale))
}

export function getProductWithVariants(code: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProductWithVariant {
  const product = getProduct(code, locale, productList)
  const variants = getProductVariants(product, productList)

  return {
    ...product,
    variants
  }
}

export function flattenProductVariants(products: LocalizedProductWithVariant[]): LocalizedProductWithVariant[] {
  const flattenProducts = uniqBy(
    products.flatMap(product => product.variants).concat(products),
    'code'
  )

  return uniqBy(
    products.flatMap(product => {
      return product.variants.map(variant => getProductWithVariants(variant.code, variant._locale, flattenProducts))
    }),
    'code'
  )
}

export const getFacets = (products: LocalizedProductWithVariant[]): LocalizedProductWithVariant['facets'] => {
  return products.reduce((facets, product) => {
    Object.entries(product.facets).map(([facetName, facetValues]) => {
      facets[facetName] = facets[facetName] || []

      facetValues?.forEach(facetValue => {
        if (!facets[facetName]?.includes(facetValue)) {
          facets[facetName]?.push(facetValue)
        }
      })
    })

    return facets
  }, {} as LocalizedProductWithVariant['facets'])
}

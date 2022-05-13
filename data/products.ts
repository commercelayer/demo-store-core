import uniqBy from 'lodash/uniqBy'
import productsJson from './json/products.json'

type Localized<T> = {
  [locale: string]: T
}


type Primitives = number | string | undefined

type NestedFacet = {
  [nested: string]: Primitives
}


type HierarchyFacet = {
  [child: string]: Primitives | Primitives[]
}

export type AlgoliaFacets = {
  [name: string]: Primitives | Primitives[] | HierarchyFacet | NestedFacet[]
}

type FacetsResult = {
  [name: string]: {
    [value: string]: number
  } | {
    [value: string]: number
  }[]
}

export type Facets = {
  [name: string]: string[] | undefined
}

export type Product = {
  productCode: string
  variantCode: string
  code: string
  slug: string
  variant: Variant[]
  facets: Facets
  name: Localized<string>
  description: Localized<string>
  images: string[]
}

export type ProductWithVariants = Product & {
  variants: Product[]
}

export type Variant = {
  name: string
  value: string
  label: Localized<string>
}

export type LocalizedVariant = Omit<Variant, 'label'> & {
  label: string
}

export type LocalizedProduct = Omit<Product, 'name' | 'description' | 'variant'> & {
  _locale: string
  name: string
  description: string
  variant: LocalizedVariant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}

const products: Product[] = productsJson

const groupedBaseProducts: { [code: string]: Product[] } = products.reduce((acc, cv) => {
  acc[cv.productCode] = acc[cv.productCode] || []
  acc[cv.productCode].push(cv)
  return acc
}, {} as { [code: string]: Product[] })


function resolveProductLocale(product: Product, locale: string): LocalizedProduct {
  const [language] = locale.split('-')

  return {
    ...product,
    _locale: locale,
    name: product.name[locale] || product.name[language],
    description: product.description[locale] || product.description[language],
    variant: product.variant.map(v => ({
      ...v,
      label: v.label[locale] || v.label[language]
    }))
  }
}

export function getProduct(code: string, locale: string): LocalizedProduct {
  const product = products.find(product => product.code === code)

  if (!product) {
    throw new Error(`Cannot find a Product with code equal to ${code}`)
  }

  return resolveProductLocale(product, locale)
}

export function getProductVariants(product: LocalizedProduct): LocalizedProduct[] {
  const variants = groupedBaseProducts[product.productCode]
  return variants.map(p => resolveProductLocale(p, product._locale))
}

export function getProductWithVariants(code: string, locale: string): LocalizedProductWithVariant {
  const product = getProduct(code, locale)
  const variants = getProductVariants(product)

  return {
    ...product,
    variants
  }
}

export function flattenProductVariants(products: LocalizedProductWithVariant[]): LocalizedProductWithVariant[] {
  return uniqBy(
    products.flatMap(product => {
      return product.variants.map(variant => getProductWithVariants(variant.code, variant._locale))
    }),
    'code'
  )
}

export const getFacets = (products: LocalizedProductWithVariant[]): Facets => {
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
  }, {} as Facets)
}

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

/** @deprecated */
export const getVariantFacets = (products: LocalizedProductWithVariant[]): Facets => {
  return products.reduce((facets, product) => {
    product.variant.forEach((variant) => {
      facets[variant.name] = facets[variant.name] || []

      if (!facets[variant.name]?.includes(variant.value)) {
        facets[variant.name]?.push(variant.value)
      }
    })

    return facets
  }, {} as Facets)
}

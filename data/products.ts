import { LocalizedField } from '#i18n/locale'
import productsJson from './json/products.json'

export type Product = {
  productCode: string
  variantCode: string
  code: string
  slug: string
  name: LocalizedField<string>
  description: LocalizedField<string>
  images: string[]

  // TODO: replace with flat model + config file
  variant: Variant[]
  facets: Facets
}

export const rawDataProducts: Product[] = productsJson



export type Facets = {
  [name: string]: string[] | undefined
}

export type Variant = {
  name: string
  value: string
  label: LocalizedField<string>
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

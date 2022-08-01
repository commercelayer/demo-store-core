import facetsConfig from '#config/facets.config'
import get from 'lodash/get'
import type { LocalizedProductWithVariant } from './products'

export type Primitives = number | string | boolean

/**
 * 
 *
 * @example
 * {
 *   "color": ["red", "orange", "yellow", "green", "blue"],
 *   "sleeves": "short",
 *   "available": true
 * }
 */
type SimpleFacet = Primitives | string[] // TODO: fuse is not working with number[] & boolean[]

/**
 * 
 * 
 * @example
 * {
 *   "people": [
 *     {
 *       "first_name": "John",
 *       "last_name": "Doe"
 *     },
 *     {
 *       "first_name": "Jane",
 *       "last_name": "Doe"
 *     }
 *   ]
 * }
 */
type NestingFacet = {
  [nested: string]: Primitives
}

/**
 * 
 * 
 * @example
 * {
 *   "categories": {
 *     "level0": "Books",
 *     "level1": ["Books > Science Fiction", "Books > Literature & Fiction"],
 *     "level2": ["Books > Science Fiction > Time Travel", "Books > Literature & Fiction > Literary"]
 *   }
 * }
 */
type HierarchyFacet = {
  [child: string]: SimpleFacet
}

/**
 * 
 */
export type FacetComplete = {
  [field: string]: SimpleFacet | NestingFacet[] | HierarchyFacet
}

export type Facet = {
  [field: string]: SimpleFacet
}

export type FacetResult = {
  [facetName: string]: Primitives[]
}

export const getFacets = (products: LocalizedProductWithVariant[]): FacetResult => {
  return products.reduce((facets, product) => {
    facetsConfig.forEach(facetConfig => {
      facets[facetConfig.field] = facets[facetConfig.field] || []
    })

    facetsConfig.forEach(facetConfig => {
      const facetValues = get(product, facetConfig.field) as Facet[string]

      if (typeof facetValues === 'string' || typeof facetValues === 'number' || typeof facetValues === 'boolean' || Array.isArray(facetValues)) {
        if (Array.isArray(facetValues)) {
          facetValues.forEach(facetValue => {
            if (!facets[facetConfig.field].includes(facetValue)) {
              facets[facetConfig.field].push(facetValue)
            }
          })
        } else {
          if (!facets[facetConfig.field].includes(facetValues)) {
            facets[facetConfig.field].push(facetValues)
          }
        }
      }

    })

    return facets
  }, {} as FacetResult)
}


// const facetExample: Facet = {
//   "color": ["red", "orange", "yellow", "green", "blue"],
//   "sleeves": "short",
//   "available": true,
//   "people": [
//     {
//       "first_name": "John",
//       "last_name": "Doe"
//     },
//     {
//       "first_name": "Jane",
//       "last_name": "Doe"
//     }
//   ],
//   "category": {
//     "level0": "Books",
//     "level1": ["Books > Science Fiction", "Books > Literature & Fiction"],
//     "level2": ["Books > Science Fiction > Time Travel", "Books > Literature & Fiction > Literary"]
//   },
//   "gender": {
//     "level0": "Unisex"
//   },
//   "price": {
//     "formatted_compare_at_amount": "",
//     "formatted_amount": "",
//   }
// }

// type FacetsResult = {
//   [name: string]: { [value: string]: number } | { [value: string]: number }[]
// }

// const facetConfig = [
//   {

//   }
// ]

// const facetExampleResult: FacetsResult = {
//   'color': {
//     'red': 1,
//     'orange': 1,
//     'yellow': 1,
//     'green': 1,
//     'blue': 1
//   },
//   'sleeves': {
//     'short': 1
//   },
//   'people.first_name': {
//     'John': 1,
//     'Jane': 1
//   },
//   'categories.level0': {
//     'Books': 1
//   },
//   'categories.level1': {
//     'Books > Science Fiction': 1,
//     'Books > Literature & Fiction': 1
//   },
//   'categories.level2': {
//     'Books > Science Fiction > Time Travel': 1,
//     'Books > Literature & Fiction > Literary': 1
//   }
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
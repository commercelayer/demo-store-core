import { getFacets } from './facets'
import { getProductWithVariants } from './products';

import productsJson from '#__mocks__/products'

jest.mock('../../config/facets.config.js', () => [
  {
    field: 'gender',
    appearance: 'tag',
  },
  {
    field: 'category',
    appearance: 'tag',
  },
  {
    field: 'price.amount_float',
    appearance: 'priceRange',
  },
  {
    field: 'available',
    appearance: 'switch',
  },
  {
    field: 'color',
    appearance: 'colorSwatch',
  },
  {
    field: 'size',
    appearance: 'tag',
  },
  {
    field: 'facetA',
    appearance: 'tag',
  },
])


test('"getFacets" should return combined facets for provided product list', () => {
  const products = getFacets([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it', productsJson),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it', productsJson)
  ])

  expect(products).toStrictEqual({
    category: [],
    gender: [],
    "available": [],
    "price.amount_float": [],
    facetA: ['000000', 'FFFFFF'],
    color: ['000000', 'FFFFFF'],
    size: ['12 months', '6 months']
  })
})

test.skip('"getAlgoliaFacets" should return combined facets for provided product list', () => {
  // @ts-expect-error
  const products = getAlgoliaFacets([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it', productsJson),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it', productsJson)
  ])

  expect(products).toStrictEqual({
    categories: [
      {
        Baby: 4,
      },
      {
        'Baby > Body': 4,
        'Baby > Short Body': 4
      },
      {
        'Baby > Body > 12 months': 2,
        'Baby > Short Body > 12 months': 2
      }
    ],
    color: {
      '000000': 2,
      'FFFFFF': 2
    },
    size: {
      '12 months': 2,
      '6 months': 2
    }
  })
})

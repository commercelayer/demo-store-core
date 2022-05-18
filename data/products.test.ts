import { flattenProductVariants, getFacets, getProductWithVariants } from './products';

jest.mock('./json/products.json')

test('"getProductWithVariants" should returns the product by provided code', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should returns the localized product by provided code and locale', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en-US')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en-US - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en-US - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should fallback to locale language when locale is not found', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it-CN')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for it - Body nero a maniche corte per bebè con logo bianco')
  expect(product.description).toStrictEqual('Translation for it - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should throws an error when the "code" is not found', () => {
  expect(() => getProductWithVariants('ABCD', 'en')).toThrowError()
})

test('"getProductWithVariants" should returns the variants for the provived Product', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it')

  expect(product.productCode).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')

  expect(product.variants).toMatchObject([
    { _locale: 'it', code: 'BODYBSSS000000FFFFFF12MX' },
    { _locale: 'it', code: 'BODYBSSS000000FFFFFF6MXX' },
    { _locale: 'it', code: 'BODYBSSSFFFFFF00000012MX' },
    { _locale: 'it', code: 'BODYBSSSFFFFFF0000006MXX' }
  ])
})

test('"flattenProductVariants" should flatten product variants', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it')

  const products = flattenProductVariants([product, product])

  expect(products).toStrictEqual([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it'),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it')
  ])
})

test('"getFacets" should return combined facets for provided product list', () => {
  const products = getFacets([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it'),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it')
  ])

  expect(products).toStrictEqual({
    color: ['000000', 'FFFFFF'],
    size: ['12 months', '6 months']
  })
})

test.skip('"getAlgoliaFacets" should return combined facets for provided product list', () => {
  // @ts-expect-error
  const products = getAlgoliaFacets([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it'),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it'),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it')
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

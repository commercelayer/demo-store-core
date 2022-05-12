import { flattenProductVariants, getFacets, getProduct, getProductVariants, getProductWithVariants, getVariantFacets } from './products';

jest.mock('./json/products.json')

test('"getProduct" should returns the product by provided code', () => {
  const product = getProduct('BODYBSSS000000FFFFFF12MX', 'en')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProduct" should returns the localized product by provided code and locale', () => {
  const product = getProduct('BODYBSSS000000FFFFFF12MX', 'en-US')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en-US - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en-US - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProduct" should fallback to locale language when locale is not found', () => {
  const product = getProduct('BODYBSSS000000FFFFFF12MX', 'it-CN')

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for it - Body nero a maniche corte per bebè con logo bianco')
  expect(product.description).toStrictEqual('Translation for it - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProduct" should throws an error when the "code" is not found', () => {
  expect(() => getProduct('ABCD', 'en')).toThrowError()
})

test('"getProductVariants" should returns the variants for the provived Product', () => {
  const product = getProduct('BODYBSSS000000FFFFFF6MXX', 'it')
  const variants = getProductVariants(product)

  expect(variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX', 'it'),
    getProduct('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProduct('BODYBSSSFFFFFF00000012MX', 'it'),
    getProduct('BODYBSSSFFFFFF0000006MXX', 'it')
  ])
})

test('"getProductWithVariants" should returns the variants for the provived Product', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it')

  expect(product.productCode).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')

  expect(product.variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX', 'it'),
    getProduct('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProduct('BODYBSSSFFFFFF00000012MX', 'it'),
    getProduct('BODYBSSSFFFFFF0000006MXX', 'it')
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

test('"getVariantFacets" should return all variants as facets', () => {
  const products = getVariantFacets([
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

import { flattenProductVariants, getProductWithVariants } from './products';

import productsJson from './__mocks__/products.json'


test('"getProductWithVariants" should returns the product by provided code', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en', productsJson)

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should returns the localized product by provided code and locale', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en-US', productsJson)

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for en-US - Black Baby Short Sleeve Bodysuit with White Logo')
  expect(product.description).toStrictEqual('Translation for en-US - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should fallback to locale language when locale is not found', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it-CN', productsJson)

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('Translation for it - Body nero a maniche corte per bebè con logo bianco')
  expect(product.description).toStrictEqual('Translation for it - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getProductWithVariants" should fallback to empty string when locale and language are not found', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'xx-CN', productsJson)

  expect(product.productCode).toStrictEqual('BODYBSSS')
  expect(product.name).toStrictEqual('')
  expect(product.description).toStrictEqual('')
})

test('"getProductWithVariants" should throws an error when the "code" is not found', () => {
  expect(() => getProductWithVariants('ABCD', 'en', productsJson)).toThrowError()
})

test('"getProductWithVariants" should returns the variants for the provived Product', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson)

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
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson)

  const products = flattenProductVariants([product, product])

  expect(products).toStrictEqual([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it', productsJson),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it', productsJson)
  ])
})

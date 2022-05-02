import { getProduct, getProductVariants, getProductWithVariants } from './products';

jest.mock('./json/products.json')

test('"getProduct" should returns the product by provided code', () => {
  const product = getProduct('BODYBSSS000000FFFFFF6MXX')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual({
    en: 'Black Baby Short Sleeve Bodysuit with White Logo',
    it: 'Body nero a maniche corte per bebè con logo bianco'
  })
})


test('"getProduct" should resolves product localization', () => {
  const product = getProduct('BODYBSSS000000FFFFFF6MXX', 'en')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual('Black Baby Short Sleeve Bodysuit with White Logo')
})

test('"getProduct" should throws an error when the "code" is not found', () => {
  expect(() => getProduct('ABCD', 'en')).toThrowError()
})

test('"getProductVariants" should returns the variants for the provived Product', () => {
  const product = getProduct('BODYBSSS000000FFFFFF6MXX')
  const variants = getProductVariants(product)

  expect(variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX'),
    getProduct('BODYBSSS000000FFFFFF6MXX'),
    getProduct('BODYBSSSFFFFFF00000012MX'),
    getProduct('BODYBSSSFFFFFF0000006MXX')
  ])
})

test('"getProductVariants" should resolves variants localization', () => {
  const product = getProduct('BODYBSSS000000FFFFFF6MXX')
  const variants = getProductVariants(product, 'it')

  expect(variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX', 'it'),
    getProduct('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProduct('BODYBSSSFFFFFF00000012MX', 'it'),
    getProduct('BODYBSSSFFFFFF0000006MXX', 'it')
  ])
})

test('"getProductWithVariants" should returns the variants for the provived Product', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual({
    en: 'Black Baby Short Sleeve Bodysuit with White Logo',
    it: 'Body nero a maniche corte per bebè con logo bianco'
  })

  expect(product.variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX'),
    getProduct('BODYBSSS000000FFFFFF6MXX'),
    getProduct('BODYBSSSFFFFFF00000012MX'),
    getProduct('BODYBSSSFFFFFF0000006MXX')
  ])
})

test('"getProductWithVariants" should resolves variants localization', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')

  expect(product.variants).toStrictEqual([
    getProduct('BODYBSSS000000FFFFFF12MX', 'it'),
    getProduct('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProduct('BODYBSSSFFFFFF00000012MX', 'it'),
    getProduct('BODYBSSSFFFFFF0000006MXX', 'it')
  ])
})

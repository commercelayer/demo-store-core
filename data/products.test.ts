import { getBaseProducts, getProduct, getProductVariants, getProductWithVariants } from './products';

jest.mock('./json/products.json')

test('"getBaseProducts" should returns only base products', () => {
  const baseProducts = getBaseProducts()

  expect(baseProducts.length).toStrictEqual(3)

  expect(baseProducts[0].baseProduct).toStrictEqual('BODYBSSS')
  expect(baseProducts[1].baseProduct).toStrictEqual('BOTT17OZ')
  expect(baseProducts[2].baseProduct).toStrictEqual('CUFFBEAN')

  expect(baseProducts[0].name).toStrictEqual({
    'en-US': 'en-US Black Baby Short Sleeve Bodysuit with White Logo',
    en: 'Black Baby Short Sleeve Bodysuit with White Logo',
    it: 'Body nero a maniche corte per bebè con logo bianco'
  })
})

test('"getBaseProducts" should resolves product localization using language', () => {
  const baseProducts = getBaseProducts('it')

  expect(baseProducts.length).toStrictEqual(3)

  expect(baseProducts[0].baseProduct).toStrictEqual('BODYBSSS')
  expect(baseProducts[1].baseProduct).toStrictEqual('BOTT17OZ')
  expect(baseProducts[2].baseProduct).toStrictEqual('CUFFBEAN')

  expect(baseProducts[0].name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')
  expect(baseProducts[0].description).toStrictEqual('This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

test('"getBaseProducts" should resolves product localization using language-COUNTRY', () => {
  const baseProducts = getBaseProducts('en-US')

  expect(baseProducts.length).toStrictEqual(3)

  expect(baseProducts[0].baseProduct).toStrictEqual('BODYBSSS')
  expect(baseProducts[1].baseProduct).toStrictEqual('BOTT17OZ')
  expect(baseProducts[2].baseProduct).toStrictEqual('CUFFBEAN')

  expect(baseProducts[0].name).toStrictEqual('en-US Black Baby Short Sleeve Bodysuit with White Logo')
  expect(baseProducts[0].description).toStrictEqual('en-US This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
})

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

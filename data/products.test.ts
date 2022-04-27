import { getBaseProducts, getProductByCode, getProductVariants } from './products';

// jest.mock('./json/products.json')

test('"getBaseProducts" should returns only base products', () => {
  const baseProducts = getBaseProducts()

  expect(baseProducts.length).toStrictEqual(3)

  expect(baseProducts[0].baseProduct).toStrictEqual('BODYBSSS')
  expect(baseProducts[1].baseProduct).toStrictEqual('BOTT17OZ')
  expect(baseProducts[2].baseProduct).toStrictEqual('CUFFBEAN')

  expect(baseProducts[0].name).toStrictEqual({
    en: 'Black Baby Short Sleeve Bodysuit with White Logo',
    it: 'Body nero a maniche corte per bebè con logo bianco'
  })
})

test('"getBaseProducts" should resolves product localization', () => {
  const baseProducts = getBaseProducts('it')

  expect(baseProducts.length).toStrictEqual(3)

  expect(baseProducts[0].baseProduct).toStrictEqual('BODYBSSS')
  expect(baseProducts[1].baseProduct).toStrictEqual('BOTT17OZ')
  expect(baseProducts[2].baseProduct).toStrictEqual('CUFFBEAN')

  expect(baseProducts[0].name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')
})

test('"getProductByCode" should returns the product by provided code', () => {
  const product = getProductByCode('BODYBSSS000000FFFFFF6MXX')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual({
    en: 'Black Baby Short Sleeve Bodysuit with White Logo',
    it: 'Body nero a maniche corte per bebè con logo bianco'
  })
})


test('"getProductByCode" should resolves product localization', () => {
  const product = getProductByCode('BODYBSSS000000FFFFFF6MXX', 'en')

  expect(product.baseProduct).toStrictEqual('BODYBSSS')

  expect(product.name).toStrictEqual('Black Baby Short Sleeve Bodysuit with White Logo')
})

test('"getProductByCode" should returns the variants for the provived Product', () => {
  const product = getProductByCode('BODYBSSS000000FFFFFF6MXX')
  const variants = getProductVariants(product)

  expect(variants).toStrictEqual([
    getProductByCode('BODYBSSS000000FFFFFF12MX'),
    getProductByCode('BODYBSSS000000FFFFFF6MXX'),
    getProductByCode('BODYBSSSFFFFFF00000012MX'),
    getProductByCode('BODYBSSSFFFFFF0000006MXX')
  ])
})

test('"getProductByCode" should resolves variants localization', () => {
  const product = getProductByCode('BODYBSSS000000FFFFFF6MXX')
  const variants = getProductVariants(product, 'it')

  expect(variants).toStrictEqual([
    getProductByCode('BODYBSSS000000FFFFFF12MX', 'it'),
    getProductByCode('BODYBSSS000000FFFFFF6MXX', 'it'),
    getProductByCode('BODYBSSSFFFFFF00000012MX', 'it'),
    getProductByCode('BODYBSSSFFFFFF0000006MXX', 'it')
  ])
})


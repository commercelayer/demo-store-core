import { spreadProductVariants, getProductWithVariants } from './products';

import productsJson from '#__mocks__/products'

describe('getProductWithVariants', () => {
  it('should returns the product by provided code', () => {
    const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en', productsJson)

    expect(product.productCode).toStrictEqual('BODYBSSS')
    expect(product.name).toStrictEqual('Translation for en - Black Baby Short Sleeve Bodysuit with White Logo')
    expect(product.description).toStrictEqual('Translation for en - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
  })

  it('should returns the localized product by provided code and locale', () => {
    const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'en-US', productsJson)

    expect(product.productCode).toStrictEqual('BODYBSSS')
    expect(product.name).toStrictEqual('Translation for en-US - Black Baby Short Sleeve Bodysuit with White Logo')
    expect(product.description).toStrictEqual('Translation for en-US - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
  })

  it('should fallback to locale language when locale is not found', () => {
    const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it-CN', productsJson)

    expect(product.productCode).toStrictEqual('BODYBSSS')
    expect(product.name).toStrictEqual('Translation for it - Body nero a maniche corte per bebè con logo bianco')
    expect(product.description).toStrictEqual('Translation for it - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
  })

  it('should fallback to default locale when locale and language are not found', () => {
    const product = getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'xx-CN', productsJson)

    expect(product.productCode).toStrictEqual('BODYBSSS')
    expect(product.name).toStrictEqual('Translation for en - Black Baby Short Sleeve Bodysuit with White Logo')
    expect(product.description).toStrictEqual('Translation for en - This comfortable baby one-piece is made of 100% combed ring-spun cotton except for heather grey color, which contains polyester. The lap shoulders ensure that the bodysuit can be easily put on and taken off, making for easy changing.')
  })

  it('should throws an error when the "code" is not found', () => {
    expect(() => getProductWithVariants('ABCD', 'en', productsJson)).toThrowError()
  })

  it('should returns the variants for the provived Product', () => {
    const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson)

    expect(product.productCode).toStrictEqual('BODYBSSS')

    expect(product.name).toStrictEqual('Body nero a maniche corte per bebè con logo bianco')

    expect(product.variants).toMatchObject([
      { _locale: 'it', sku: 'BODYBSSS000000FFFFFF12MX' },
      { _locale: 'it', sku: 'BODYBSSS000000FFFFFF6MXX' },
      { _locale: 'it', sku: 'BODYBSSSFFFFFF00000012MX' },
      { _locale: 'it', sku: 'BODYBSSSFFFFFF0000006MXX' }
    ])
  })

  it('should remove inner-variants when getting product variants to avoid deep nesting', () => {
    const product = getProductWithVariants(
      'BODYBSSS000000FFFFFF6MXX', 
      'it',
      [
        getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it', productsJson),
        getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson),
      ]
    )

    // @ts-expect-error
    expect(product.variants[0].variants).not.toBeDefined()

    // @ts-expect-error
    expect(product.variants[1].variants).not.toBeDefined()
  })

  it('should throw an error when generating variant object of a product that have an invalid field (not a string)', () => {
    expect(() => getProductWithVariants('ABCD-INVALID-VARIANT-TYPE', 'it', productsJson))
      .toThrowError('The variant property "color" for the product ABCD-INVALID-VARIANT-TYPE must be a string. Found ["000000"].')
  })
})

test('"spreadProductVariants" should spread product variants', () => {
  const product = getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson)

  const products = spreadProductVariants([product, product])

  expect(products).toStrictEqual([
    getProductWithVariants('BODYBSSS000000FFFFFF12MX', 'it', productsJson),
    getProductWithVariants('BODYBSSS000000FFFFFF6MXX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF00000012MX', 'it', productsJson),
    getProductWithVariants('BODYBSSSFFFFFF0000006MXX', 'it', productsJson)
  ])
})

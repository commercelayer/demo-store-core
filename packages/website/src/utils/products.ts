import variantsConfig from '#config/variants.config'
import { translateField } from '#utils/locale'
import type { RawDataProduct } from '#data/products'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

export type Variant = {
  name: string
  value: string
}

export type LocalizedProduct = Omit<RawDataProduct, 'name' | 'description' | 'variant' | 'details'> & {
  _locale: string
  name: string
  description: string
  variant: Variant[]

  // TODO: this should be removed when PLP
  details: {
    title: string
    content: string
  }[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}



function resolveProductLocale(product: RawDataProduct | LocalizedProduct | LocalizedProductWithVariant, locale: string): LocalizedProduct | LocalizedProductWithVariant {
  if ('_locale' in product) {
    return {
      ...product
    }
  }

  const variant: Variant[] = []

  variantsConfig.forEach(config => {
    if (config.field in product) {
      const value = get(product, config.field)

      if (typeof value !== 'string') {
        throw new Error(`The variant property "${config.field}" for the product ${product.sku} must be a string. Found ${JSON.stringify(value)}.`)
      }

      variant.push({
        name: config.field,
        value
      })
    }
  })

  return {
    ...product,
    _locale: locale,
    name: translateField(product, 'name', locale),
    description: translateField(product, 'description', locale),
    variant,
    details: product.details?.map(detail => ({
      title: translateField(detail, 'title', locale),
      content: translateField(detail, 'content', locale)
    })) || []
  }
}

export function getProduct(sku: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProduct {
  const product = productList.find(product => product.sku === sku)

  if (!product) {
    throw new Error(`Cannot find a Product with sku equal to ${sku}`)
  }

  return resolveProductLocale(product, locale)
}

function getProductVariants(product: LocalizedProduct, productList: (RawDataProduct | LocalizedProduct | LocalizedProductWithVariant)[]): LocalizedProduct[] {
  return productList
    .filter(p => p.productCode === product.productCode)
    .map(p => {
      const localizedProduct = resolveProductLocale(p, product._locale)

      if ('variants' in localizedProduct) {
        // @ts-expect-error
        delete localizedProduct['variants']
        return localizedProduct as LocalizedProduct
      }

      return localizedProduct
    })
}

export function getProductWithVariants(sku: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProductWithVariant {
  const product = getProduct(sku, locale, productList)
  const variants = getProductVariants(product, productList)

  return {
    ...product,
    variants
  }
}

export function addProductVariants(product: LocalizedProduct, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProductWithVariant {
  const variants = getProductVariants(product, productList)

  return {
    ...product,
    variants
  }
}

/**
 * Given a list of products, it moves all the variants at top level.
 */
export function spreadProductVariants(products: LocalizedProductWithVariant[]): LocalizedProductWithVariant[] {
  return uniqBy(
    products.reduce((flattenProductWithVariants, product) => {
      flattenProductWithVariants.push(
        ...product.variants.map(v => ({ ...v, variants: product.variants }))
      )
      return flattenProductWithVariants
    }, [] as LocalizedProductWithVariant[]),
    'sku'
  )
}

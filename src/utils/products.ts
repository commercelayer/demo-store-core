import type { RawDataProduct } from '#data/products'
import { translateField } from '#i18n/locale'
import variantsConfig from 'config/variants.config'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

export type Variant = {
  name: string
  value: string
}

export type LocalizedProduct = Omit<RawDataProduct, 'name' | 'description' | 'variant'> & {
  _locale: string
  name: string
  description: string
  variant: Variant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}



function resolveProductLocale(product: RawDataProduct | LocalizedProduct | LocalizedProductWithVariant, locale: string): LocalizedProduct | LocalizedProductWithVariant {
  if ('_locale' in product) {
    return product
  }

  const variant: Variant[] = []

  variantsConfig.forEach(config => {
    if (config.field in product) {
      const value = get(product, config.field)

      if (typeof value !== 'string') {
        throw new Error(`The variant property "${config.field}" for the product ${product.code} must be a string. Found ${JSON.stringify(value)}.`)
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
    name: translateField(product.name, locale),
    description: translateField(product.description, locale),
    variant
  }
}

function getProduct(code: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProduct {
  const product = productList.find(product => product.code === code)

  if (!product) {
    throw new Error(`Cannot find a Product with code equal to ${code}`)
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

export function getProductWithVariants(code: string, locale: string, productList: (LocalizedProduct | RawDataProduct)[]): LocalizedProductWithVariant {
  const product = getProduct(code, locale, productList)
  const variants = getProductVariants(product, productList)

  return {
    ...product,
    variants
  }
}

export function flattenProductVariants(products: LocalizedProductWithVariant[]): LocalizedProductWithVariant[] {
  const flattenProducts = uniqBy(
    products.flatMap(product => product.variants).concat(products),
    'code'
  )

  return uniqBy(
    products.flatMap(product => {
      return product.variants.map(variant => getProductWithVariants(variant.code, variant._locale, flattenProducts))
    }),
    'code'
  )
}

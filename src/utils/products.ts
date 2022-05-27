import type { RawDataProduct } from '#data/products'
import { translateField } from '#i18n/locale'
import uniqBy from 'lodash/uniqBy'

export type LocalizedVariant = Omit<RawDataProduct['variant'][number], 'label'> & {
  label: string
}


export type LocalizedProduct = Omit<RawDataProduct, 'name' | 'description' | 'variant'> & {
  _locale: string
  name: string
  description: string
  variant: LocalizedVariant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}



function resolveProductLocale(product: RawDataProduct | LocalizedProduct | LocalizedProductWithVariant, locale: string): LocalizedProduct | LocalizedProductWithVariant {
  if ('_locale' in product) {
    return product
  }

  return {
    ...product,
    _locale: locale,
    name: translateField(product.name, locale),
    description: translateField(product.description, locale),
    variant: product.variant.map(v => ({
      ...v,
      label: translateField(v.label, locale)
    }))
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

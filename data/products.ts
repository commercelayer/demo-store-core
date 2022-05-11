import uniqBy from 'lodash/uniqBy'
import productsJson from './json/products.json'

type Localized<T> = {
  [locale: string]: T
}

export type Facets = {
  [name: string]: string[] | undefined
}

export type Product = {
  productCode: string
  variantCode: string
  code: string
  slug: string
  variant: Variant[]
  name: Localized<string>
  description: Localized<string>
  images: string[]
}

export type ProductWithVariants = Product & {
  variants: Product[]
}

export type Variant = {
  name: string
  value: string
  label: Localized<string>
}

export type LocalizedVariant = Omit<Variant, 'label'> & {
  label: string
}

export type LocalizedProduct = Omit<Product, 'name' | 'description' | 'variant'> & {
  _locale: string
  name: string
  description: string
  variant: LocalizedVariant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}

const products: Product[] = productsJson

const groupedBaseProducts: { [code: string]: Product[] } = products.reduce((acc, cv) => {
  acc[cv.productCode] = acc[cv.productCode] || []
  acc[cv.productCode].push(cv)
  return acc
}, {} as { [code: string]: Product[] })


function resolveProductLocale(product: Product, locale: string): LocalizedProduct {
  const [language] = locale.split('-')

  return {
    ...product,
    _locale: locale,
    name: product.name[locale] || product.name[language],
    description: product.description[locale] || product.description[language],
    variant: product.variant.map(v => ({
      ...v,
      label: v.label[locale] || v.label[language]
    }))
  }
}

export function getProduct(code: string): Product
export function getProduct(code: string, locale: string): LocalizedProduct
export function getProduct(code: string, locale?: string) {
  const product = products.find(product => product.code === code)

  if (!product) {
    throw new Error(`Cannot find a Product with code equal to ${code}`)
  }

  if (locale) {
    return resolveProductLocale(product, locale)
  }

  return product
}

export function getProductVariants(product: Product | LocalizedProduct): Product[]
export function getProductVariants(product: Product | LocalizedProduct, locale: string): LocalizedProduct[]
export function getProductVariants(product: Product | LocalizedProduct, locale?: string) {
  const variants = groupedBaseProducts[product.productCode]

  if (locale) {
    return variants.map(product => resolveProductLocale(product, locale))
  }

  return variants
}

// TODO: remove methods without locale ?!
export function getProductWithVariants(code: string): ProductWithVariants
export function getProductWithVariants(code: string, locale: string): LocalizedProductWithVariant
export function getProductWithVariants(code: string, locale?: string) {
  const product = locale ? getProduct(code, locale) : getProduct(code)
  const variants = locale ? getProductVariants(product, locale) : getProductVariants(product)

  return {
    ...product,
    variants
  }
}

export function flattenProductVariants(products: LocalizedProductWithVariant[]): LocalizedProductWithVariant[] {
  return uniqBy(
    products.flatMap(product => {
      return product.variants.map(variant => getProductWithVariants(variant.code, variant._locale))
    }),
    'code'
  )
}

export const getVariantFacets = (products: LocalizedProductWithVariant[]): Facets => {
  return products.reduce((acc, product) => {
    product.variant.forEach((variant) => {
      acc[variant.name] = acc[variant.name] || []

      if (!acc[variant.name]?.includes(variant.value)) {
        acc[variant.name]?.push(variant.value)
      }
    })

    return acc
  }, {} as Facets)
}
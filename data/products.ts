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

export function getProduct(code: string, locale: string): LocalizedProduct {
  const product = products.find(product => product.code === code)

  if (!product) {
    throw new Error(`Cannot find a Product with code equal to ${code}`)
  }

  return resolveProductLocale(product, locale)
}

export function getProductVariants(product: LocalizedProduct): LocalizedProduct[] {
  const variants = groupedBaseProducts[product.productCode]
  return variants.map(p => resolveProductLocale(p, product._locale))
}

export function getProductWithVariants(code: string, locale: string): LocalizedProductWithVariant {
  const product = getProduct(code, locale)
  const variants = getProductVariants(product)

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
  return products.reduce((facets, product) => {
    product.variant.forEach((variant) => {
      facets[variant.name] = facets[variant.name] || []

      if (!facets[variant.name]?.includes(variant.value)) {
        facets[variant.name]?.push(variant.value)
      }
    })

    return facets
  }, {} as Facets)
}
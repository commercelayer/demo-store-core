import productsJson from './json/products.json'

type Localized<T> = {
  [locale: string]: T
}

export type Product = {
  baseProduct: string
  code: string
  slug?: string
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
  name: string
  description: string
  variant: LocalizedVariant[]
}

export type LocalizedProductWithVariant = LocalizedProduct & {
  variants: LocalizedProduct[]
}

export const products: Product[] = productsJson

const groupedBaseProducts: { [code: string]: Product[] } = products.reduce((acc, cv) => {
  acc[cv.baseProduct] = acc[cv.baseProduct] || []
  acc[cv.baseProduct].push(cv)
  return acc
}, {} as { [code: string]: Product[] })


function resolveProductLocale(product: Product, locale: string): LocalizedProduct {
  const [language] = locale.split('-')

  return {
    ...product,
    name: product.name[locale] || product.name[language],
    description: product.description[locale] || product.description[language],
    variant: product.variant.map(v => ({
      ...v,
      label: v.label[locale] || v.label[language]
    }))
  }
}

export function getBaseProducts(): ProductWithVariants[]
export function getBaseProducts(locale: string): LocalizedProductWithVariant[]
export function getBaseProducts(locale?: string) {
  const baseProductValues = Object.values(groupedBaseProducts)

  return baseProductValues.map(([product]) => {
    return locale ? getProductWithVariants(product.code, locale) : getProductWithVariants(product.code)
  })
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
  const variants = groupedBaseProducts[product.baseProduct]

  if (locale) {
    return variants.map(product => resolveProductLocale(product, locale))
  }

  return variants
}

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

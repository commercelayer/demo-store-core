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
  primaryImage: string
  images: string[]
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

export function getBaseProducts(): Product[]
export function getBaseProducts(locale: string): LocalizedProduct[]
export function getBaseProducts(locale?: string) {
  const baseProductValues = Object.values(groupedBaseProducts)

  if (locale) {
    return baseProductValues.map(([product]) => resolveProductLocale(product, locale))
  }

  return baseProductValues.map(([product]) => product)
}

export function getProductByCode(code: string): Product
export function getProductByCode(code: string, locale: string): LocalizedProduct
export function getProductByCode(code: string, locale?: string) {
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

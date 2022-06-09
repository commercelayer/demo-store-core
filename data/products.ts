import type { LocalizedField } from '#i18n/locale'
import type { Price } from '@commercelayer/sdk'
import productsJson from './json/products.json'

export type RawDataProduct = {
  productCode: string
  variantCode: string
  sku: string
  slug: string
  name: LocalizedField<string>
  description: LocalizedField<string>
  images: string[]

  available?: boolean

  price?: Price
}

export const rawDataProducts: RawDataProduct[] = productsJson

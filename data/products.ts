import type { LocalizedField } from '#i18n/locale'
import productsJson from './json/products.json'

export type RawDataProduct = {
  productCode: string
  variantCode: string
  code: string
  slug: string
  name: LocalizedField<string>
  description: LocalizedField<string>
  images: string[]

  available?: boolean

  price?: {
    id: string
    amount_cents?: number
    amount_float?: number
    compare_at_amount_cents?: number
    compare_at_amount_float?: number
    currency_code?: string
    formatted_amount?: string
    formatted_compare_at_amount?: string
  }

  // TODO: replace with flat model + config file
  variant: {
    name: string
    value: string
    label: LocalizedField<string>
  }[]
}

export const rawDataProducts: RawDataProduct[] = productsJson

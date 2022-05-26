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

  // TODO: replace with flat model + config file
  variant: {
    name: string
    value: string
    label: LocalizedField<string>
  }[]
  
  // TODO: replace with flat model + config file
  facets: {
    [name: string]: string[] | undefined
  }
}

export const rawDataProducts: RawDataProduct[] = productsJson

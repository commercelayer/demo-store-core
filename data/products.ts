import { localizedFieldSchema } from '#i18n/locale'
import type { Price } from '@commercelayer/sdk'
import { z } from 'zod'
import productsJson from './json/products.json'

const productSchema = z.object({
  productCode: z.string(),
  variantCode: z.string(),
  sku: z.string(),
  slug: z.string(),
  name: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  images: z.string().array()
})

export type RawDataProduct = z.infer<typeof productSchema> & {
  available?: boolean
  price?: Price
}

export const rawDataProducts: RawDataProduct[] = productSchema.passthrough().array().parse(productsJson);

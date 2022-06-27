import { localizedFieldSchema } from '#i18n/locale'
import type { Price } from '@commercelayer/sdk'
import { z } from 'zod'

import productsJson from './json/products.json'

const detailSchema = z.object({
  title: localizedFieldSchema(z.string()),
  content: localizedFieldSchema(z.string())
})

const productSchema = z.object({
  productCode: z.string(),
  variantCode: z.string(),
  sku: z.string(),
  slug: z.string(),
  name: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  images: z.string().array(),
  details: detailSchema.array().optional()
})

export type RawDataProduct = z.infer<typeof productSchema> & {
  available?: boolean
  price?: Price
}

// TODO: this should be unserializable
export const rawDataProducts: RawDataProduct[] = productSchema.passthrough().array().parse(productsJson);

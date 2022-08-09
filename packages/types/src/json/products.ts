import { z } from 'zod'
import { localizedFieldSchema } from '../utils/locale'

const detail_schema = z.object({
  title: localizedFieldSchema(z.string()),
  content: localizedFieldSchema(z.string())
})

const product_schema = z.object({
  productCode: z.string(),
  variantCode: z.string(),
  sku: z.string(),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  name: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  images: z.string().array(),
  details: detail_schema.array().optional()
})

export const rawDataProducts_schema = product_schema.passthrough().array()

export type RawDataProduct = z.infer<typeof product_schema>

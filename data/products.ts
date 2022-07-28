import { fetchData } from '#utils/data'
import { localizedFieldSchema } from '#utils/locale'
import type { Price } from '@commercelayer/sdk'
import memoize from 'lodash/memoize'
import { z } from 'zod'

export const getRawDataProducts = memoize(
  async function(): Promise<RawDataProduct[]> {
    // TODO: this should be unserializable
    return productSchema.passthrough().array().parse(
      await fetchData('products')
    )
  }
)


const detailSchema = z.object({
  title: localizedFieldSchema(z.string()),
  content: localizedFieldSchema(z.string())
})

const productSchema = z.object({
  productCode: z.string(),
  variantCode: z.string(),
  sku: z.string(),
  slug: z.string().transform(slug => slug.replace(/^\//, '')),
  name: localizedFieldSchema(z.string()),
  description: localizedFieldSchema(z.string()),
  images: z.string().array(),
  details: detailSchema.array().optional()
})

export type RawDataProduct = z.infer<typeof productSchema> & {
  available?: boolean
  price?: Price
}

import { localizedFieldSchema } from '#i18n/locale'
import type { Price } from '@commercelayer/sdk'
import { z } from 'zod'

import productsJson from '#config/json/products.json'


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


const rawDataProducts = productSchema.passthrough().array().parse(productsJson)

export const getRawDataProducts = async (): Promise<RawDataProduct[]> => {
  // const dataFolder = './json'
  // const productsJson = (await import(`${dataFolder}/products.json`)).default
  // const productsJson = await fetch('http://localhost:3001/json/products.json')
  //   .then(response => response.json())

  // TODO: this should be unserializable
  return rawDataProducts
  return productSchema.passthrough().array().parse(productsJson)
}

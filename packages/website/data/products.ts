import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { RawDataProduct as BaseRawDataProduct, rawDataProducts_schema } from '@commercelayer/demo-store-types'
import type { Price } from '@commercelayer/sdk'

export const getRawDataProducts = memoize(
  async function(): Promise<RawDataProduct[]> {
    // TODO: this should be unserializable
    return rawDataProducts_schema.parse(
      await fetchJsonData('products')
    )
  }
)

export type RawDataProduct = BaseRawDataProduct & {
  available?: boolean
  price?: Price
}

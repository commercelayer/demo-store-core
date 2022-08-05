import { fetchJsonData } from '#utils/data'
import { RawDataProduct as BaseRawDataProduct, rawDataProducts_schema } from '@commercelayer/demo-store-types'
import type { Price } from '@commercelayer/sdk'
import memoize from 'lodash/memoize'

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

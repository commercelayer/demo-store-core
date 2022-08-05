import { fetchJsonData } from '#utils/data'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { RawDataPages, rawDataPages_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataPages = memoize(
  async function (): Promise<Unserializable<RawDataPages>> {
    return makeUnserializable(
      rawDataPages_schema.parse(
        await fetchJsonData('pages')
      )
    )
  }
)

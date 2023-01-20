import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { makeUnserializable, Unserializable } from '#utils/unserializable'
import { RawDataPages, rawDataPages_schema } from '@commercelayer/demo-store-types'

export const getRawDataPages = memoize(
  async function (): Promise<Unserializable<RawDataPages>> {
    return makeUnserializable(
      rawDataPages_schema.parse(
        await fetchJsonData('pages')
      )
    )
  }
)

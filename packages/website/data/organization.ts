import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { RawDataOrganization, rawDataOrganization_schema } from '@commercelayer/demo-store-types'

export const getRawDataOrganization = memoize(
  async function(): Promise<RawDataOrganization> {
    return rawDataOrganization_schema.parse(
      await fetchJsonData('organization')
    )
  }
)

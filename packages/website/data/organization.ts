import { fetchData } from '#utils/data'
import { RawDataOrganization, rawDataOrganization_schema } from '@commercelayer/demo-store-types'
import memoize from 'lodash/memoize'

export const getRawDataOrganization = memoize(
  async function(): Promise<RawDataOrganization> {
    return rawDataOrganization_schema.parse(
      await fetchData('organization')
    )
  }
)

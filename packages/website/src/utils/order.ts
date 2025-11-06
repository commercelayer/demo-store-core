import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import type { ShoppableLocale } from '#i18n/locale'
import { jwtDecode, jwtIsSalesChannel } from '@commercelayer/js-auth'

export const getPersistKey = (accessToken: string, locale: ShoppableLocale): string => {
  const decodedToken = jwtDecode(accessToken)

  if (!jwtIsSalesChannel(decodedToken.payload)) {
    throw new Error('Invalid access token: not a Sales Channel token')
  }

  return `clayer_order-${NEXT_PUBLIC_BASE_PATH}/${decodedToken.payload.owner?.id ?? 'guest'}-${locale.country.code}`
}

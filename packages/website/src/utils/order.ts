import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import type { ShoppableLocale } from '#i18n/locale'

export const getPersistKey = (locale: ShoppableLocale): string => `clayer_order-${NEXT_PUBLIC_BASE_PATH}/${locale.country.code}`

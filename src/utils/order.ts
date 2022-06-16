import type { ShoppableLocale } from '#i18n/locale'
import { basePath } from '#next.config'

export const getPersistKey = (locale: ShoppableLocale): string => `clayer_order-${basePath ? `${basePath}/` : '/'}${locale.country.code}`

import { basePath } from '#config/general.config'
import type { ShoppableLocale } from '#i18n/locale'

export const getPersistKey = (locale: ShoppableLocale): string => `clayer_order-${basePath ? `${basePath}/` : '/'}${locale.country.code}`

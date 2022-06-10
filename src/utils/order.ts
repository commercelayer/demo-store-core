import type { ShoppableLocale } from '#i18n/locale'

export const getPersistKey = (locale: ShoppableLocale): string => `country-${locale.country.code}`

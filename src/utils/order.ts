import type { Locale } from '#i18n/locale'

export const getPersistKey = (locale: Locale): string => `country-${locale?.country?.code}`

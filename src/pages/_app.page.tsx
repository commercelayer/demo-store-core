import { Auth } from '#components/Auth'
import { SettingsProvider } from '#contexts/SettingsContext'
import { defaultLocale, getLocale } from '#i18n/locale'
import { getPersistKey } from '#utils/order'
import { LineItemsContainer, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import { I18nProvider } from 'next-localization'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import './_app.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { lngDict, settingsContext, ...rest } = pageProps
  const localeCode = router.query.locale as unknown as string | string[] | undefined

  if (Array.isArray(localeCode)) {
    throw new Error('The query "locale" cannot be an array!')
  }

  const locale = getLocale(localeCode || defaultLocale)

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${router.basePath}/${router.query.locale}` : undefined
  const cart_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${router.basePath}/${router.query.locale}/cart` : undefined

  if (locale.isShoppable === false) {
    return (
      <SettingsProvider {...settingsContext}>
        <I18nProvider lngDict={lngDict} locale={localeCode || defaultLocale}>
          <Component {...rest} />
        </I18nProvider>
      </SettingsProvider>
    )
  }

  return (
    <SettingsProvider {...settingsContext}>
      <I18nProvider lngDict={lngDict} locale={localeCode || defaultLocale}>
        <Auth>
          <OrderStorage persistKey={getPersistKey(locale)}>
            <OrderContainer attributes={{
              language_code: locale?.language.code,
              return_url,
              cart_url
            }}>
              <LineItemsContainer>
                <Component {...rest} />
              </LineItemsContainer>
            </OrderContainer>
          </OrderStorage>
        </Auth>
      </I18nProvider>
    </SettingsProvider>
  )
}

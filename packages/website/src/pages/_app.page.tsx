import { Auth } from '#components/Auth'
import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import { SettingsProvider } from '#contexts/SettingsContext'
import { getPersistKey } from '#utils/order'
import { LineItemsContainer, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import { I18nProvider } from 'next-localization'
import type { AppProps } from 'next/app'
import React from 'react'

import './_app.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// suppress useLayoutEffect (and its warnings) when not running in a browser
if (typeof window === 'undefined') {
  React.useLayoutEffect = () => { }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const { lngDict, settingsContext = {}, ...rest } = pageProps

  const { locale } = settingsContext

  if (!locale) {
    return (
      <Component {...rest} />
    )
  }

  if (locale.isShoppable === false) {
    return (
      <SettingsProvider {...settingsContext}>
        <I18nProvider lngDict={lngDict} locale={locale.code}>
          <Component {...rest} />
        </I18nProvider>
      </SettingsProvider>
    )
  }

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}` : undefined
  const cart_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}/cart` : undefined

  return (
    <SettingsProvider {...settingsContext}>
      <I18nProvider lngDict={lngDict} locale={locale.code}>
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

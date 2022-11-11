import { Auth } from '#components/Auth'
import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import { SettingsContext, SettingsProvider } from '#contexts/SettingsContext'
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

type PageProps = {
  lngDict?: object
  settingsContext?: Partial<SettingsContext>
}

function isSettingsContext(item: Partial<SettingsContext>): item is SettingsContext {
  return item.locale !== undefined && item.organization !== undefined
}

export default function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const { lngDict, settingsContext = {}, ...rest } = pageProps

  if (!isSettingsContext(settingsContext)) {
    return (
      <Component {...rest} />
    )
  }

  if (settingsContext.locale.isShoppable === false) {
    return (
      <SettingsProvider {...settingsContext}>
        <I18nProvider lngDict={lngDict} locale={settingsContext.locale.code}>
          <Component {...rest} />
        </I18nProvider>
      </SettingsProvider>
    )
  }

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${settingsContext.locale.code}` : undefined
  const cart_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${settingsContext.locale.code}/cart` : undefined

  return (
    <SettingsProvider {...settingsContext}>
      <I18nProvider lngDict={lngDict} locale={settingsContext.locale.code}>
        <Auth>
          <OrderStorage persistKey={getPersistKey(settingsContext.locale)}>
            <OrderContainer attributes={{
              language_code: settingsContext.locale.language.code,
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

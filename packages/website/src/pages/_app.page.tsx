import { Auth } from '#components/Auth'
import { SettingsContext, SettingsProvider } from '#contexts/SettingsContext'
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

  return (
    <SettingsProvider {...settingsContext}>
      <I18nProvider lngDict={lngDict} locale={settingsContext.locale.code}>
        <Auth locale={settingsContext.locale}>
          <Component {...rest} />
        </Auth>
      </I18nProvider>
    </SettingsProvider>
  )
}

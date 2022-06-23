import { Auth } from '#components/Auth'
import { defaultLocale, getLocale } from '#i18n/locale'
import { getPersistKey } from '#utils/order'
import { LineItemsContainer, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import { I18nProvider } from 'next-localization'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { lngDict, ...rest } = pageProps
  const localeCode = router.query.locale as unknown as string | string[] | undefined

  if (Array.isArray(localeCode)) {
    throw new Error('The query "locale" cannot be an array!')
  }

  const locale = getLocale(localeCode || defaultLocale)

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${router.basePath}/${router.query.locale}` : undefined

  if (locale.isShoppable === false) {
    return (
      <I18nProvider lngDict={lngDict} locale={localeCode || defaultLocale}>
        <Component {...rest} />
      </I18nProvider>
    )
  }

  return (
    <I18nProvider lngDict={lngDict} locale={localeCode || defaultLocale}>
      <Auth>
        <OrderStorage persistKey={getPersistKey(locale)}>
          <OrderContainer attributes={{
            language_code: locale?.language.code,
            return_url
          }}>
            <LineItemsContainer>
              <Component {...rest} />
            </LineItemsContainer>
          </OrderContainer>
        </OrderStorage>
      </Auth>
    </I18nProvider>
  )
}

import { defaultLocale } from '#i18n/locale'
import { I18nProvider } from 'next-localization'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Auth } from 'src/auth/Auth'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { lngDict, ...rest } = pageProps
  const locale = router.query.locale

  if (Array.isArray(locale)) {
    throw new Error('The query "locale" cannot be an array!')
  }

  return (
    <I18nProvider lngDict={lngDict} locale={locale || defaultLocale}>
      <Auth>
        <Component {...rest} />
      </Auth>
    </I18nProvider>
  )
}

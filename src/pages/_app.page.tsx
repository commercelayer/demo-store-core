import { I18nProvider } from 'next-localization'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Auth } from 'src/auth/Auth'

import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { lngDict, ...rest } = pageProps

  return (
    <I18nProvider lngDict={lngDict} locale={router.query.locale as string | undefined || ''}>
      <Auth>
        <Component {...rest} />
      </Auth>
    </I18nProvider>
  )
}

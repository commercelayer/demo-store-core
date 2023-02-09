import { AuthProvider } from '#contexts/AuthContext'
import { useSettingsContext } from '#contexts/SettingsContext'
import type { ShoppableLocale } from '#i18n/locale'
import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import { getPersistKey } from '#utils/order'
import { AuthReturnType, ClientCredentials, getSalesChannelToken } from '@commercelayer/js-auth'
import { CommerceLayer, LineItemsContainer, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import type { DefaultChildrenType } from '@commercelayer/react-components/lib/esm/typings/globals'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Auth = {
  accessToken: string
  refreshToken?: string
  expires?: number
  tokenType: string
}

const getClientCredentials = (clientId: string, endpoint: string, market: number): ClientCredentials => ({
  clientId,
  endpoint,
  scope: `market:${market}`
})

const getAuth = (market: number): Auth | null => {
  const storeKey = getStoreKey(market)
  return JSON.parse(localStorage.getItem(storeKey) || 'null')
}

const storeAuth = (market: number, authReturn: Awaited<AuthReturnType>): Auth | null => {
  if (!authReturn) {
    return null
  }

  const storeKey = getStoreKey(market)

  const auth: Auth = {
    tokenType: authReturn.tokenType,
    accessToken: authReturn.accessToken,
    expires: authReturn.expires?.getTime(),
    refreshToken: authReturn.refreshToken
  }

  localStorage.setItem(storeKey, JSON.stringify(auth))

  return auth
}

const getStoreKey = <M extends number>(market: M): `clayer_token-market:${M}` => `clayer_token-market:${market}`

const hasExpired = (time: number | undefined): boolean => time === undefined || time < Date.now()

const isValid = (auth: Auth | null): auth is Auth => !hasExpired(auth?.expires)

type Props = {
  children: DefaultChildrenType
  locale: ShoppableLocale
}

export const Auth: React.FC<Props> = ({ children, locale }) => {

  const router = useRouter()
  const settings = useSettingsContext()

  const [market, setMarket] = useState<number | undefined>(settings.locale?.isShoppable ? settings.locale?.country.market : undefined)
  const [auth, setAuth] = useState<Auth | null>(null)

  const clientId = process.env.NEXT_PUBLIC_CL_CLIENT_ID
  const endpoint = process.env.NEXT_PUBLIC_CL_ENDPOINT

  useEffect(function updateMarket() {
    if (settings.locale?.isShoppable && settings.locale?.country.market !== market) {
      setMarket(settings.locale?.country.market)
    }
  }, [settings.locale, market])

  useEffect(function updateAccessToken() {
    let isMounted = true

    if (market === undefined || clientId === undefined || endpoint === undefined) {
      setAuth(null)
      return
    }

    const storedAuth: Auth | null = getAuth(market)
    const authIsValid = isValid(storedAuth)

    if (authIsValid) {
      setAuth(storedAuth)
    } else {
      getSalesChannelToken(getClientCredentials(clientId, endpoint, market))
        .then(authReturn => {
          if (isMounted) {
            setAuth(storeAuth(market, authReturn))
          }
        })
    }

    return () => {
      isMounted = false
    }
  }, [market, router.asPath, clientId, endpoint])

  if (!auth || !endpoint) {
    return (
      <>
        <CommerceLayer accessToken='' endpoint=''>
          <OrderContainer>
            <LineItemsContainer>
              {children}
            </LineItemsContainer>
          </OrderContainer>
        </CommerceLayer>
      </>
    )
  }

  const { hostname } = new URL(endpoint)
  const [, organization, domain] = hostname.match(/^(.*).(commercelayer.(co|io))$/) || []

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}` : undefined
  const cart_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}/cart` : undefined

  return (
    <AuthProvider accessToken={auth.accessToken} endpoint={endpoint} organization={organization} domain={domain}>
      <CommerceLayer accessToken={auth.accessToken} endpoint={endpoint}>
        <OrderStorage persistKey={getPersistKey(locale)}>
          <OrderContainer attributes={{
            language_code: locale.language.code,
            return_url,
            cart_url
          }}>
            <LineItemsContainer>
              {children}
            </LineItemsContainer>
          </OrderContainer>
        </OrderStorage>
      </CommerceLayer>
    </AuthProvider>
  )
}

import { AuthProvider } from '#contexts/AuthContext'
import { useSettingsContext } from '#contexts/SettingsContext'
import type { ShoppableLocale } from '#i18n/locale'
import { NEXT_PUBLIC_BASE_PATH } from '#utils/envs'
import { getPersistKey } from '#utils/order'
import { makeSalesChannel, getCoreApiBaseEndpoint, type ApiCredentialsAuthorization } from '@commercelayer/js-auth'
import { CommerceLayer, LineItemsContainer, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import type { DefaultChildrenType } from '@commercelayer/react-components/lib/esm/typings/globals'
import { useRouter, type NextRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  children: DefaultChildrenType
  locale: ShoppableLocale
}

type Market = number | `id:${string}` | `code:${string}`

function removeAuthParamsAndReload(pathname: string, searchParams: URLSearchParams, router: NextRouter): void {
  const authSearchParams = ['accessToken', 'scope', 'expires', 'refreshToken']
  const hasAuthParams = authSearchParams.some(param => searchParams.has(param))

  if (!hasAuthParams) {
    return
  }

  const newSearchParams = new URLSearchParams(searchParams.toString())
  authSearchParams.forEach(param => newSearchParams.delete(param))

  const newParams = newSearchParams.toString()

  router.push(`${pathname}${newParams !== '' ? `?${newParams}` : ''}`, undefined, { shallow: true })
}

export const Auth: React.FC<Props> = ({ children, locale }) => {
  const router = useRouter()
  const settings = useSettingsContext()

  const [market, setMarket] = useState<Market | undefined>(settings.locale?.isShoppable ? settings.locale?.country.market : undefined)
  const [authorization, setAuthorization] = useState<ApiCredentialsAuthorization | null>(null)

  const clientId = process.env.NEXT_PUBLIC_CL_CLIENT_ID

  useEffect(function updateMarket() {
    if (settings.locale?.isShoppable && settings.locale?.country.market !== market) {
      setMarket(settings.locale?.country.market)
    }
  }, [settings.locale, market])

  const salesChannel = useMemo(() => {
    if (market === undefined || clientId === undefined) {
      return null
    }

    return makeSalesChannel(
      {
        clientId,
        scope: `market:${market}`
      },
      {
        storage: {
          async getItem(key) {
            return JSON.parse(localStorage.getItem(key) || 'null')
          },
          async setItem(key, value) {
            localStorage.setItem(key, JSON.stringify(value))
          },
          async removeItem(key) {
            localStorage.removeItem(key)
          }
        }
      }
    )
  }, [market, clientId])

  useEffect(function updateAccessToken() {
    let isMounted = true;

    (async () => {
      if (salesChannel == null) {
        setAuthorization(null)
        return
      }

      const [pathname, queryString] = router.asPath.split('?')
      const searchParams = new URLSearchParams(queryString)

      const paramAccessToken = searchParams.get('accessToken')
      const paramScope = searchParams.get('scope')

      if (paramAccessToken != null && paramScope != null) {
        const refreshToken = searchParams.get('refreshToken')
        await salesChannel.setCustomer({
          accessToken: paramAccessToken,
          scope: paramScope,
          refreshToken: refreshToken ?? undefined
        })
      }

      const authorization = await salesChannel.getAuthorization()

      if (isMounted) {
        setAuthorization(authorization)
      }

      removeAuthParamsAndReload(pathname, searchParams, router)
    })()

    return () => {
      isMounted = false
    }
  }, [salesChannel, router.asPath])

  const logoutCustomer = useCallback(async () => {
    if (salesChannel) {
      await salesChannel.logoutCustomer()
      setAuthorization(await salesChannel.getAuthorization())
    }
  }, [salesChannel])

  if (!authorization) {
    return null
    // return (
    //   <>
    //     <CommerceLayer accessToken='' endpoint=''>
    //       <OrderContainer>
    //         <LineItemsContainer>
    //           {children}
    //         </LineItemsContainer>
    //       </OrderContainer>
    //     </CommerceLayer>
    //   </>
    // )
  }

  const endpoint = getCoreApiBaseEndpoint(authorization.accessToken)
  const { hostname } = new URL(endpoint)
  const [, organization, domain] = hostname.match(/^(.*).(commercelayer.(co|io))$/) || []

  const return_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}` : undefined
  const cart_url = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}${NEXT_PUBLIC_BASE_PATH}/${locale.code}?cl-cart--open` : undefined

  return (
    <AuthProvider key={authorization.accessToken} logoutCustomer={logoutCustomer} authorization={authorization} endpoint={endpoint} organization={organization} domain={domain}>
      <CommerceLayer accessToken={authorization.accessToken} endpoint={endpoint}>
        <OrderStorage clearWhenPlaced persistKey={getPersistKey(authorization.accessToken, locale)}>
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

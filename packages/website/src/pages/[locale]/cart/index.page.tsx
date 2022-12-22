import type { HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { Title } from '#components/Title'
import { useAuthContext } from '#contexts/AuthContext'
import { serverSideSettings, useSettingsContext } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getLocale, getShoppableLocales } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { getPersistKey } from '#utils/order'
import { useOrderContainer } from '@commercelayer/react-components/hooks/useOrderContainer'
import IframeResizer from 'iframe-resizer-react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const CartPage: React.FC<HeaderProps> = ({ navigation }) => {
  const [cartUrl, setCartUrl] = useState<string | null>(null)
  const { reloadOrder, order } = useOrderContainer()

  const i18n = useI18n()
  const auth = useAuthContext()
  const settings = useSettingsContext()

  const router = useRouter()

  const cartTitle = i18n.t('general.yourCart')

  useEffect(() => {
    let isMounted = true

    ; (async () => {
      if (isMounted) {
        if (settings.locale?.isShoppable && auth.accessToken && settings.organization?.slug) {
          const persistKey = getPersistKey(settings.locale)
          const orderFromStorage = localStorage.getItem(persistKey)

          if (orderFromStorage === null) {
            setCartUrl(`https://${settings.organization.slug}.commercelayer.app/cart/null?embed=true&accessToken=${auth.accessToken}`)
          } else {
            if (order !== undefined) {
              setCartUrl(`https://${settings.organization.slug}.commercelayer.app/cart/${order.id}?embed=true&accessToken=${auth.accessToken}`)
            }
          }
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [router.query.locale, auth, settings.organization, settings.locale, order])

  return (
    <Page localeCodes={[]} navigation={navigation} title={cartTitle}>
      <Title title={<>{cartTitle}</>}></Title>
      {
        cartUrl && (
          <IframeResizer
            checkOrigin={false}
            onMessage={
              (event) => {
                if (event.message.type === 'update') {
                  reloadOrder()
                }
              }
            }
            style={{ width: '1px', minWidth: '100%' }}
            src={cartUrl} />
        )
      }
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return withLocalePaths({
    paths: [],
    fallback: false
  }, await getShoppableLocales())
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { locale: localeCode } = params!
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default CartPage
import { useSettingsContext } from '#contexts/SettingsContext'
import { getRGBColor } from '#utils/css'
import { NEXT_PUBLIC_BASE_PATH, SITE_URL } from '#utils/envs'
import { switchLocale } from '#utils/locale'
import { useI18n } from 'next-localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container } from './Container'
import { Footer } from './Footer'
import { Header, HeaderProps } from './Header'

type Props = Partial<HeaderProps> & {
  title?: string
  description?: string
  canonical?: string
  PageTemplate?: React.FC<PageTemplateProps>
  localeCodes: string[]
}

type PageTemplateProps = HeaderProps

const DefaultPageTemplate: React.FC<PageTemplateProps> = ({
  navigation,
  children
}) => {
  return (
    <>
      <Container>
        <Header navigation={navigation} />
        {children}
      </Container>
      <Footer />
    </>
  )
}

export const Page: React.FC<Props> = ({
  navigation,
  children,
  title,
  canonical,
  description,
  localeCodes,
  PageTemplate = DefaultPageTemplate
}) => {
  const router = useRouter()
  const i18n = useI18n()
  const settings = useSettingsContext()

  return (
    <>
      <Head>
        <title>{`${title ? `${title} - ` : ''}${settings.organization?.name || i18n.t('seo.title')}`}</title>
        <meta name='description' content={description || i18n.t('seo.description')} />
        <link rel='icon' href={settings.organization?.favicon_url || NEXT_PUBLIC_BASE_PATH + '/favicon.ico'} />
        <link rel='manifest' href={settings.organization?.manifest || NEXT_PUBLIC_BASE_PATH + '/manifest.json'} />
        {canonical && <link rel='canonical' href={`${SITE_URL}/${router.query.locale}${canonical}`} />}
        <style>{`
          :root {
            --color-primary: ${getRGBColor(settings.organization?.primary_color || '#666EFF')};
          }
        `}</style>

        {
          // https://developers.google.com/search/docs/specialty/international/localized-versions?hl=en#html
          localeCodes.map(code => <link key={code} rel="alternate" hrefLang={code} href={`${SITE_URL}${switchLocale(router.asPath, code)}`} />)
        }
      </Head>

      <main className='flex flex-col h-screen'>
        <PageTemplate navigation={navigation}>
          { children }
        </PageTemplate>
      </main>
    </>
  )
}

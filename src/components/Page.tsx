import { basePath } from '#config/general.config'
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
  PageTemplate = DefaultPageTemplate
}) => {
  const router = useRouter()
  const i18n = useI18n()

  return (
    <>
      <Head>
        <title>{`${title ? `${title} - ` : ''}${i18n.t('seo.title')}`}</title>
        <meta name='description' content={description || i18n.t('seo.description')} />
        <link rel='icon' href={basePath + '/favicon.ico'} />
        {canonical && <link rel='canonical' href={`${router.basePath}/${router.query.locale}${canonical}`} />}
      </Head>

      <main className='flex flex-col h-screen'>
        <PageTemplate navigation={navigation}>
          { children }
        </PageTemplate>
      </main>
    </>
  )
}

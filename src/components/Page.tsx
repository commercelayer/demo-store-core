import { basePath } from '#next.config'
import { useI18n } from 'next-localization'
import Head from 'next/head'
import { useRouter } from 'next/router'

type Props = {
  title?: string
  description?: string
  canonical?: string
}

export const Page: React.FC<Props> = ({
  children,
  title,
  canonical,
  description
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

      <main>
        { children }
      </main>
    </>
  )
}

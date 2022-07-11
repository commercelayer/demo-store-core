import { getCatalog } from '#utils/catalog'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './CustomPageComponent'
import { getPages } from '#utils/pages'
import { serverSideSettings } from '#contexts/SettingsContext'

type Query = {
  locale: string
  slug?: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {

    const pages = await getPages(localeCode)

    return {
      fallback: false,
      paths: pages.map(page => ({
        params: {
          slug: page.slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  const pages = await getPages(localeCode)
  const page = pages.find(page => page.slug === (slug ? slug.join('/') : ''))

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      components: page.components,
      ...(await serverSideSettings()),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({ params })
}

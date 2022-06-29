import { getCatalog } from '#utils/catalog'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './CustomPageComponent'
import { getPages } from '#utils/pages'

type Query = {
  locale: string
  slug?: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(localeCode => {

    const pages = getPages(localeCode)
    const slugs = pages.map(page => page.slug.replace(/^\//, ''))

    return {
      fallback: false,
      paths: slugs.map(slug => ({
        params: {
          slug: slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  const pages = getPages(localeCode)
  const page = pages.find(page => page.slug === `/${slug ? slug.join('/') : ''}`)

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      components: page.components,
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

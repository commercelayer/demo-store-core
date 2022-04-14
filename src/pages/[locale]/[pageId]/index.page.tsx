import { withLocalePaths } from '#i18n/withLocalePaths'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { CountrySelector } from '../../../components/CountrySelector'

type Query = {
  pageId: string
  locale: string
}

type Props = {
  params: Query
}

export default function Home({ params }: Props): JSX.Element {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CountrySelector />

      <h1>Page {JSON.stringify(params)}</h1>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: [
      {
        params: {
          pageId: '1'
        }
      },
      {
        params: {
          pageId: '2'
        }
      }
    ],
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async (context) => {
  return {
    props: {
      params: context.params!
    }
  }
}

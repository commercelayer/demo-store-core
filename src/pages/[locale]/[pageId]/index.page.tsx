import { withLocalePaths } from '#i18n/withLocalePaths'
import { basePath } from '#next.config'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { CountrySelector } from '../../../components/CountrySelector'
import styles from '../../../styles/Home.module.css'


type Query = {
  pageId: string
  locale: string
}

type Props = {
  params?: Query
}

export default function Home({ params }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href={basePath + '/favicon.ico'} />
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

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  return {
    props: {
      params
    }
  }
}

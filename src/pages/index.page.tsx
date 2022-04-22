import { CountrySelector } from '#components/CountrySelector'
import { basePath } from '#next.config'
import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Commerce Layer | Demo Store</title>
        <meta name='description' content='Commerce Layer is a transactional commerce API that lets you add multi-market ecommerce to any digital experience, with ease.' />
        <link rel='icon' href={basePath + '/favicon.ico'} />
      </Head>

      <CountrySelector />
    </div>
  )
}

export default Home

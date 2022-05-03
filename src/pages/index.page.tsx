import { CountrySelector } from '#components/CountrySelector'
import { Page } from '#components/Page'
import { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Page>
      <CountrySelector />
    </Page>
  )
}

export default Home

import { CountrySelector } from '#components/CountrySelector'
import { Page } from '#components/Page'
import type { NextPage } from 'next'

const CountrySelectorPage: NextPage = () => {
  return (
    <Page>
      <CountrySelector />
    </Page>
  )
}

export default CountrySelectorPage

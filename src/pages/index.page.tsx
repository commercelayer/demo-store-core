import { CountrySelector } from '#components/CountrySelector'
import { Page } from '#components/Page'
import { defaultLanguage } from '#config/general.config'
import { serverSideSettings } from '#contexts/SettingsContext'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'

const CountrySelectorPage: NextPage = () => {
  return (
    <Page PageTemplate={({ children }) => <>{children}</>}>
      <CountrySelector />
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...(await serverSideSettings(defaultLanguage)),
      ...(await serverSideTranslations(defaultLanguage))
    }
  }
}

export default CountrySelectorPage

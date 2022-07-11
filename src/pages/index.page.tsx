import { CountrySelector } from '#components/CountrySelector'
import { Page } from '#components/Page'
import { serverSideSettings } from '#contexts/SettingsContext'
import { defaultLocale } from '#i18n/locale'
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
      ...(await serverSideSettings()),
      ...(await serverSideTranslations(defaultLocale))
    }
  }
}

export default CountrySelectorPage

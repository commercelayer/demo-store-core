import { CountrySelector, Props as CountrySelectorProps } from '#components/CountrySelector'
import { Page } from '#components/Page'
import { defaultLanguage } from '#config/general.config'
import { serverSideSettings } from '#contexts/SettingsContext'
import { getRawDataCountries } from '#data/countries'
import { getRawDataLanguages } from '#data/languages'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'

type Props = CountrySelectorProps

const CountrySelectorPage: NextPage<Props> = ({ languages, countries }) => {
  return (
    <Page PageTemplate={({ children }) => <>{children}</>}>
      <CountrySelector languages={languages} countries={countries} />
    </Page>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      languages: await getRawDataLanguages(),
      countries: await getRawDataCountries(),
      ...(await serverSideSettings(defaultLanguage)),
      ...(await serverSideTranslations(defaultLanguage))
    }
  }
}

export default CountrySelectorPage

import { CountrySelector, Props as CountrySelectorProps } from '#components/CountrySelector'
import { Page } from '#components/Page'
import { NEXT_PUBLIC_DEFAULT_LANGUAGE } from '#utils/envs'
import { serverSideSettings } from '#contexts/SettingsContext'
import { getRawDataCountries } from '#data/countries'
import { getRawDataLanguages } from '#data/languages'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'

type Props = CountrySelectorProps

const CountrySelectorPage: NextPage<Props> = ({ languages, countries }) => {
  return (
    <Page localeCodes={[]} PageTemplate={({ children }) => <>{children}</>}>
      <CountrySelector languages={languages} countries={countries} />
    </Page>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      languages: await getRawDataLanguages(),
      countries: await getRawDataCountries(),
      ...(await serverSideSettings(NEXT_PUBLIC_DEFAULT_LANGUAGE)),
      ...(await serverSideTranslations(NEXT_PUBLIC_DEFAULT_LANGUAGE))
    }
  }
}

export default CountrySelectorPage

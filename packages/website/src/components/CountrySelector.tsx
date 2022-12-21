import { Accordion } from '#components/Accordion'
import { Logo } from '#components/Logo'
import { NEXT_PUBLIC_DEFAULT_LANGUAGE } from '#utils/envs'
import { useSettingsContext } from '#contexts/SettingsContext'
import { Link } from '#i18n/Link'
import { groupByRegion } from '#utils/countries'
import { makeLocaleCode } from '#utils/locale'
import type { RawDataCountry, RawDataLanguage } from '@commercelayer/demo-store-types'
import { useI18n } from 'next-localization'
import styles from './CountrySelector.module.scss'

export type Props = {
  languages: RawDataLanguage[]
  countries: RawDataCountry[]
}

export const CountrySelector: React.FC<Props> = ({ languages, countries }) => {
  const i18n = useI18n()
  const groupedCountry = Object.entries(groupByRegion(countries))
  const internationalLanguage = languages.find(language => language.code === NEXT_PUBLIC_DEFAULT_LANGUAGE)
  const settings = useSettingsContext()

  return (
    <div className='flex flex-col h-screen'>
      <div className={styles.countriesContainer}>

        <h1>
          <Logo className='border-b border-b-gray-100 md:border-b-0 md:flex md:justify-center' />
          <span className='sr-only'>{settings.organization?.name || i18n.t('seo.title')}</span>
        </h1>

        <div className={styles.title}>
          {i18n.t('general.countrySelector.chooseCountry')}
        </div>

        <div className={styles.accordionContainer} style={{ gridTemplateColumns: groupedCountry.map(() => '1fr').join(' ') }}>
          {
            groupedCountry.map(([regionName, countries]) => (
              <Accordion key={regionName} title={<div className='font-extrabold'>{regionName.toUpperCase()}</div>}>
                <div>
                  {
                    countries.map(country => {
                      const locale = makeLocaleCode(country.languages[0], country.code)
                      return (
                        <Link key={locale} locale={locale} className={styles.countryLink}>{country.name}</Link>
                      )
                    })
                  }
                </div>
              </Accordion>
            ))
          }
        </div>
      </div>

      {
        internationalLanguage && (
          <div className='bg-gray-50 border-t border-gray-200 mt-12 pt-6 pb-6 flex'>
            <div className='container mx-auto px-6'>
              {i18n.t('general.countrySelector.otherCountries')}
              <Link locale={internationalLanguage.code} className='font-semibold block'>
                {i18n.t('general.international')} ({internationalLanguage.name})
              </Link>
            </div>
          </div>
        )
      }

    </div>
  )
}

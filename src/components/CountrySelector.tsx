import { Accordion } from '#components/Accordion'
import { Logo } from '#components/Logo'
import { useSettingsContext } from '#contexts/SettingsContext'
import { rawDataCountries } from '#data/countries'
import { rawDataLanguages } from '#data/languages'
import { Link } from '#i18n/Link'
import { makeLocaleCode } from '#i18n/locale'
import { groupByRegion } from '#utils/countries'
import { useI18n } from 'next-localization'
import styles from './CountrySelector.module.scss'


export const CountrySelector = () => {
  const i18n = useI18n()
  const groupedCountry = Object.entries(groupByRegion(rawDataCountries))
  const [defaultLanguage] = rawDataLanguages
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
                      const locale = makeLocaleCode(country.default_language, country.code)
                      return (
                        <Link key={locale} locale={locale}>
                          <a className={styles.countryLink}>{country.name}</a>
                        </Link>
                      )
                    })
                  }
                </div>
              </Accordion>
            ))
          }
        </div>
      </div>

      <div className='bg-gray-50 border-t border-gray-200 mt-12 pt-6 pb-6 flex flex-grow'>
        <div className='container mx-auto px-6'>
          {i18n.t('general.countrySelector.otherCountries')}
          <Link locale={defaultLanguage.code}>
            <a className='font-semibold block'>{i18n.t('general.international')} ({defaultLanguage.name})</a>
          </Link>
        </div>
      </div>

    </div>
  )
}

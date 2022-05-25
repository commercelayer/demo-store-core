import { Accordion } from '#components/Accordion'
import { Logo } from '#components/Logo'
import { rawDataCountries } from '#data/countries'
import { Link } from '#i18n/Link'
import { makeLocaleCode } from '#i18n/locale'
import { groupByRegion } from '#utils/countries'
import styles from './CountrySelector.module.scss'


export const CountrySelector = () => {
  const groupedCountry = Object.entries(groupByRegion(rawDataCountries))

  return (
    <div className='flex flex-col h-screen'>
      <div className={styles.countriesContainer}>

        <Logo className='border-b border-b-gray-100 md:border-b-0 md:text-center' />

        <div className={styles.title}>
          CHOOSE YOUR COUNTRY/REGION
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
          Other Countries / Regions:
          <Link locale='en'>
            <a className='font-semibold block'>International (English)</a>
          </Link>
        </div>
      </div>

    </div>
  )
}

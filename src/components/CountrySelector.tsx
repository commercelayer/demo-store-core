import { countries, groupByRegion } from '#data/countries'
import { Link } from '#i18n/Link'
import { makeLocaleCode } from '#i18n/locale'
import { basePath } from '#next.config'
import { Accordion } from './Accordion'

import styles from './CountrySelector.module.scss'

export const CountrySelector = () => {
  const groupedCountry = Object.entries(groupByRegion(countries))

  return (
    <div className='flex flex-col h-screen'>
      <div className={styles.countriesContainer}>
        <div className={styles.logo}>
          <img className='logomark' alt='Commerce Layer logomark' src={basePath + '/commercelayer-logomark.svg'} />
          <img className='logotype' alt='Commerce Layer logotype' src={basePath + '/commercelayer-logotype.svg'} />
        </div>

        <div className={styles.title}>
          CHOOSE YOUR COUNTRY/REGION
        </div>

        <div className={styles.accordionContainer} style={{ gridTemplateColumns: groupedCountry.map(() => '1fr').join(' ') }}>
          {
            groupedCountry.map(([regionName, countries]) => (
              <Accordion key={regionName} title={<div className='font-extrabold'>{regionName.toUpperCase()}</div>} content={(
                <div>
                  {
                    countries.map(country => {
                      const locale = makeLocaleCode(country.code, country.default_language)
                      return (
                        <Link key={locale} locale={locale}>
                          <a className={styles.countryLink}>{country.name}</a>
                        </Link>
                      )
                    })
                  }
                </div>
              )} />
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

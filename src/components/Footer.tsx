import { Globe } from '#assets/icons'
import { languages } from '#data/languages'
import { Link } from '#i18n/Link';
import { changeLanguage, getLocale, parseLocaleCode } from '#i18n/locale'
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Container } from '#components/Container'

export const Footer: FC = () => {
  const router = useRouter()
  const locale = getLocale(router.query.locale)

  return (
    <div className='p-16 mt-24 bg-gray-50'>
      <Container>

        <div className='flex items-center justify-between flex-wrap'>
          <div>
            <div className='flex items-center'>
              <Globe className='mr-1.5' /> {locale.country ? locale.country.name : 'International'}
              <Link locale=''>
                <a className='uppercase text-violet-400 text-xs border-b border-gray-200 ml-3 mt-1'>Choose Country</a>
              </Link>
            </div>

          </div>

          <div>
            {
              languages.map(language => {
                const isSelected = parseLocaleCode(router.query.locale).languageCode === language.code
                return (
                  <Link
                    key={language.code}
                    locale={changeLanguage(router.query.locale, language.code)}
                    scroll={false} >
                    <a className={`p-1 mx-1 ${isSelected ? 'text-black' : 'text-gray-400'}`}>{language.name}</a>
                  </Link>
                )
              })
            }
          </div>
        </div>

      </Container>
    </div>
  )
}

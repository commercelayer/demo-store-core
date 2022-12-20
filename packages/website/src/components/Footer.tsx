import { CommerceLayerGlyph, Globe, PaymentKlarna, PaymentMastercard, PaymentMastro, PaymentPaypal, PaymentStripe, PaymentVisa } from '#assets/icons'
import { Container } from '#components/Container'
import { useSettingsContext } from '#contexts/SettingsContext'
import { getRawDataLanguages } from '#data/languages'
import { Link } from '#i18n/Link'
import { changeLanguage, parseLocaleCode } from '#utils/locale'
import { isNotNullish } from '#utils/utility-types'
import type { RawDataLanguage } from '@commercelayer/demo-store-types'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { InputSelect } from './InputSelect'

export const Footer: React.FC = () => {
  const i18n = useI18n()
  const router = useRouter()
  const settings = useSettingsContext()

  const [languages, setLanguages] = useState<RawDataLanguage[]>([])

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      const rawDataLanguages = await getRawDataLanguages()

      if (isMounted) {
        if (settings.locale?.isShoppable) {
          setLanguages(
            settings.locale.country.languages.flatMap(cl => {
              return rawDataLanguages
                .filter(lang => lang.code === cl)
                .filter(isNotNullish)
            })
          )
        } else {
          setLanguages(rawDataLanguages)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className='flex-grow py-8 lg:p-16 mt-24 bg-gray-50'>
      <Container>

        <div className='lg:flex items-center justify-between flex-wrap'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center'>
                <Globe className='mr-1.5' /> {settings.locale?.country?.name || i18n.t('general.international')}
              </span>
              <Link locale='' className='uppercase text-violet-400 text-xs border-b border-gray-200 ml-3 mt-1'>
                {i18n.t('general.chooseCountry')}
              </Link>
            </div>

          </div>

          {
            languages.length > 0 && (
              <div className='mt-6 lg:mt-0'>
                <InputSelect
                  onChange={(event) => {
                    const languageCode = event.currentTarget.value
                    delete router.query.facets
                    router.push({
                      query: {
                        ...router.query,
                        locale: changeLanguage(router.query.locale, languageCode)
                      }
                    }, undefined, { scroll: false })
                  }}
                  defaultValue={parseLocaleCode(router.query.locale).languageCode}
                  options={languages.map(language => ({ value: language.code, label: language.name }))} />
              </div>
            )
          }
        </div>

        <div className='mt-6 py-6 border-y border-y-gray-100 text-xs flex flex-col md:flex-row md:divide-x'>
          <div className='py-2 md:py-0 md:pr-4'>
            <Link href='/shipping-and-payments'>Shipping & Payments</Link>
          </div>
          <div className='py-2 md:py-0 md:px-4'>
            <Link href='/returns'>Returns</Link>
          </div>
          <div className='py-2 md:py-0 md:px-4'>
            <Link href='/terms-and-conditions'>Terms and conditions</Link>
          </div>
          <div className='py-2 md:py-0 md:px-4'>
            <Link href='/cookies-and-privacy'>Cookies and privacy</Link>
          </div>
        </div>

        <div className='mt-12 flex justify-between items-center flex-col gap-6 md:flex-row'>
          <div className='text-gray-500 flex gap-4 items-start'>
            <CommerceLayerGlyph aria-label='Commerce Layer logomark' width={32} />
            <div className='text-xs leading-relaxed'>
              Copyright © 2022. Commerce Layer, Inc.<br />
              2965 Woodside Road, Woodside, CA 94062<br />
            </div>
          </div>
          <div className='text-gray-500 flex gap-4 items-start grayscale'>
            <PaymentKlarna />
            <PaymentStripe />
            <PaymentMastercard />
            <PaymentMastro />
            <PaymentPaypal />
            <PaymentVisa />
          </div>
        </div>

      </Container>
    </div>
  )
}

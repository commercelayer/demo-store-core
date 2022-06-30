import { CommerceLayerGlyph, Globe, PaymentKlarna, PaymentStripe, PaymentMastercard, PaymentMastro, PaymentPaypal, PaymentVisa } from '#assets/icons'
import { Container } from '#components/Container'
import { rawDataLanguages } from '#data/languages'
import { Link } from '#i18n/Link'
import { changeLanguage, getLocale, parseLocaleCode } from '#i18n/locale'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import { InputSelect } from './InputSelect'

export const Footer: React.FC = () => {
  const i18n = useI18n()
  const router = useRouter()
  const locale = getLocale(router.query.locale)

  return (
    <div className='flex-grow py-8 lg:p-16 mt-24 bg-gray-50'>
      <Container>

        <div className='lg:flex items-center justify-between flex-wrap'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center'>
                <Globe className='mr-1.5' /> {locale.country?.name || i18n.t('general.international')}
              </span>
              <Link locale=''>
                <a className='uppercase text-violet-400 text-xs border-b border-gray-200 ml-3 mt-1'>{i18n.t('general.chooseCountry')}</a>
              </Link>
            </div>

          </div>

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
              options={rawDataLanguages.map(language => ({ value: language.code, label: language.name }))} />
          </div>
        </div>

        <div className='mt-6 py-6 border-y border-y-gray-100 text-xs divide-x flex'>
          <div className='pr-4'>
            <Link href='/shipping-and-payments'><a>Shipping & Payments</a></Link>
          </div>
          <div className='px-4'>
            <Link href='/returns'><a>Returns</a></Link>
          </div>
          <div className='px-4'>
            <Link href='/terms-and-conditions'><a>Terms and conditions</a></Link>
          </div>
          <div className='px-4'>
            <Link href='/cookies-and-privacy'><a>Cookies and privacy</a></Link>
          </div>
        </div>

        <div className='mt-12 flex justify-between items-center flex-col gap-6 md:flex-row'>
          <div className='text-gray-500 flex gap-4 items-start'>
            <CommerceLayerGlyph aria-label='Commerce Layer logomark' width={32} />
            <div className='text-xs leading-relaxed'>
              Copyright © 2022. All Rights Reserved.<br />
              Registered company in Italy<br />
              VAT IT12345678<br />
            </div>
          </div>
          <div className='text-gray-500 flex gap-4 items-start'>
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

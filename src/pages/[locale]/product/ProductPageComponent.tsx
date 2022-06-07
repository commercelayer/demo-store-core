import { Price } from '#components/CommerceLayer/Price'
import { Container } from '#components/Container'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { VariantSelector } from '#components/VariantSelector'
import type { LocalizedProduct, LocalizedProductWithVariant } from '#utils/products'
import { getProductUrl } from '#utils/url'
import { AddToCartButton, AvailabilityContainer, AvailabilityTemplate, ItemContainer } from '@commercelayer/react-components'
import type { NextPage } from 'next'
import { useI18n } from 'next-localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

export type Props = HeaderProps & {
  product: LocalizedProductWithVariant
}

export const ProductPageComponent: NextPage<Props> = ({ navigation: links, product }) => {
  const i18n = useI18n()
  const [currentProduct, setCurrentProduct] = useState<LocalizedProduct>()
  const router = useRouter()

  return (
    <Page title={product.name}>
      <Head>
        <link rel="canonical" href={`${router.basePath}/${router.query.locale}${getProductUrl(product.variants[0].slug)}`} />
      </Head>

      <Container>
        <Header navigation={links} />

        <div className='flex mt-24 gap-48'>
          <div className='grow-0 shrink-1 basis-1/2'>
            <img src={product.images[0]} alt={product.name} className='w-full' />
          </div>

          <div className='grow-0 shrink-1 basis-1/2'>
            <ItemContainer>
              <h1 className='text-3xl mb-6'>{product.name}</h1>

              <Price code={currentProduct?.code} className='text-xl' />

              <hr className='text-gray-100 my-8' />

              <VariantSelector product={product} onChange={setCurrentProduct} />

              {/* @ts-expect-error */}
              <AddToCartButton
                skuCode={currentProduct?.code}
                label={i18n.t('general.addToCart')}
                className='block w-full mt-12 h-14 px-6 font-semibold rounded-md text-white bg-violet-400 disabled:bg-gray-300' />

              <AvailabilityContainer skuCode={currentProduct?.code}>
                <AvailabilityTemplate showShippingMethodName={true} showShippingMethodPrice={true} color={'blue'} timeFormat={'days'} />
              </AvailabilityContainer>

            </ItemContainer>
          </div>
        </div>
      </Container>

      <Footer />
    </Page>
  )
}

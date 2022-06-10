import { Carousel } from '#components/Carousel'
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
import { useMemo, useState } from 'react'

export type Props = HeaderProps & {
  product: LocalizedProductWithVariant
}

export const ProductPageComponent: NextPage<Props> = ({ navigation: links, product }) => {
  const i18n = useI18n()
  const [currentProduct, setCurrentProduct] = useState<LocalizedProduct>()

  const slides = useMemo(() => product.images.map(image => <img key={image} src={image} alt={product.name} className='w-full' />), [product])

  return (
    <Page
      canonical={getProductUrl(product.variants[0].slug)}
      title={product.name}
      description={product.description}
    >

      <Container>
        <Header navigation={links} />

        <div className='flex flex-col lg:flex-row gap-6 lg:gap-24 xl:gap-48 mt-12 lg:mt-24'>

          <div className=' basis-1/2'>
            <Carousel slides={slides} />
          </div>

          <div className='grow-0 shrink-1 basis-1/2'>
            <ItemContainer>
              <h1 className='text-3xl mb-6'>{product.name}</h1>

              <div className='min-h-[30px]'>
                <Price code={currentProduct?.sku} className='text-xl' />
              </div>

              <hr className='text-gray-100 my-8' />

              <VariantSelector product={product} onChange={setCurrentProduct} />

              {/* @ts-expect-error */}
              <AddToCartButton
                skuCode={currentProduct?.sku}
                label={i18n.t('general.addToCart')}
                className='block w-full mt-12 h-14 px-6 font-semibold rounded-md text-white bg-violet-400 disabled:bg-gray-300' />

              <AvailabilityContainer skuCode={currentProduct?.sku}>
                <AvailabilityTemplate className='mt-6'  showShippingMethodName={true} showShippingMethodPrice={true} color={'blue'} timeFormat={'days'} />
              </AvailabilityContainer>

            </ItemContainer>
          </div>

        </div>
      </Container>

      <Footer />
    </Page>
  )
}

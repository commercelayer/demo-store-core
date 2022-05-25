import { Container } from '#components/Container'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { VariantSelector as DemoStoreVariantSelector } from '#components/VariantSelector'
import { flattenProductsFromCatalog, getCatalog } from '#data/catalogs'
import { flattenProductVariants, getProductWithVariants, LocalizedProduct, LocalizedProductWithVariant } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { getProductUrl } from '#utils/url'
import { AddToCartButton, AvailabilityContainer, AvailabilityTemplate, ItemContainer, OrderContainer, OrderStorage, Price, PricesContainer } from '@commercelayer/react-components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Query = {
  locale: string
  slug: string[]
}

type Props = HeaderProps & {
  product: LocalizedProductWithVariant
}

const ProductDetailPage: NextPage<Props> = ({ navigation: links, product }) => {
  const [currentProduct, setCurrentProduct] = useState<LocalizedProduct>()
  const router = useRouter()

  const locale = getLocale(router.query.locale)

  return (
    <Page title={product.name}>
      <Head>
        <link rel="canonical" href={`${router.basePath}/${router.query.locale}${getProductUrl(product.variants[0].slug)}`} />
      </Head>

      <Container>
        <Header navigation={links} />

        <p>{product.code}</p>
        <img width="300" src={product.images[0]} alt={product.name} />
        <p>{product.name}</p>
        <p>{product.description}</p>
        <pre>{JSON.stringify(product.variant, undefined, 4)}</pre>

        <DemoStoreVariantSelector product={product} onChange={setCurrentProduct} />

        <OrderStorage persistKey={`country-${locale?.country?.code}`} clearWhenPlaced>
          <OrderContainer attributes={{
            language_code: locale?.language.code
          }}>
            <ItemContainer>
              <PricesContainer skuCode={currentProduct?.code}><Price /></PricesContainer>

              { /** @ts-expect-error */ }
              <AddToCartButton skuCode={currentProduct?.code} buyNowMode={false} checkoutUrl='https://mm-demo-store-1.checkout-test.commercelayer.app/'>
                {
                  (props) => (
                    <button onClick={props.handleClick} disabled={props.disabled} className={`block h-10 px-6 font-semibold rounded-md ${props.disabled ? 'bg-gray-300' : 'bg-black'} text-white`}>Add to cart</button>
                  )
                }
              </AddToCartButton>

              <AvailabilityContainer skuCode={currentProduct?.code}>
                <AvailabilityTemplate />
              </AvailabilityContainer>
            </ItemContainer>
          </OrderContainer>
        </OrderStorage>
      </Container>

      <Footer />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths((localeCode) => {
    const locale = getLocale(localeCode)

    const catalog = getCatalog(locale, true)

    const products = flattenProductsFromCatalog(catalog)

    const flattenProducts = flattenProductVariants(products)

    return {
      paths: flattenProducts.map(product => ({
        params: {
          slug: product.slug.split('/')
        }
      })),
      fallback: false
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { slug, locale: localeCode } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  return {
    props: {
      // TODO: slug.pop() look like a requirement. show it in the readme or change the way.
      product: getProductWithVariants(slug.pop()!, localeCode),
      navigation: getRootNavigationLinks(catalog),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default ProductDetailPage

// TODO: this will be replaced by the hosted cart!

import { Container } from '#components/Container'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { getCatalog } from '#data/catalogs'
import { getLocale } from '#i18n/locale'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { CheckoutLink, Errors, LineItem, LineItemAmount, LineItemImage, LineItemName, LineItemQuantity, LineItemRemoveLink, LineItemsCount } from '@commercelayer/react-components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

type Query = {
  locale: string
}

type Props = HeaderProps & {

}

const CartPage: NextPage<Props> = ({ navigation: links }) => {
  return (
    <Page>
      <Container>
        <Header navigation={links} />

        <p className="your-custom-class">
          Your shopping cart contains <LineItemsCount /> items
        </p>
        <LineItem>
          <LineItemImage width={50} />
          <LineItemName />
          <LineItemQuantity max={10} />
          <Errors resource="line_items" field="quantity" />
          <LineItemAmount />
          <LineItemRemoveLink className='ml-2 p-2 inline-block font-semibold rounded-md bg-red-400 text-white' />
        </LineItem>
        <br /><br />
        <CheckoutLink>
          {
            ({ href, label }) => {
              return (
                <a className='p-3 inline-block font-semibold rounded-md bg-black text-white' href={href.replace('.checkout.', '.checkout-test.')}>
                  {label}
                </a>
              )
            }
          }
        </CheckoutLink>
      </Container>

      <Footer />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: [],
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
    }
  }
}

export default CartPage

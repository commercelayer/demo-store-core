import { Navigation } from '#components/Navigation'
import { getLocale } from '#i18n/locale'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { basePath } from '#next.config'
import { CheckoutLink, Errors, LineItem, LineItemAmount, LineItemImage, LineItemName, LineItemQuantity, LineItemRemoveLink, LineItemsContainer, LineItemsCount, OrderContainer, OrderStorage } from '@commercelayer/react-components'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

type Query = {
  locale: string
}

type Props = {
  params: Query
}

const Cart: NextPage = () => {
  const router = useRouter()

  const locale = getLocale(router.query.locale as string)

  return (
    <div>
      <Head>
        <title>Commerce Layer | Demo Store</title>
        <meta name='description' content='Commerce Layer is a transactional commerce API that lets you add multi-market ecommerce to any digital experience, with ease.' />
        <link rel='icon' href={basePath + '/favicon.ico'} />
      </Head>

      <Navigation />

      <OrderStorage persistKey={`country-${locale?.country?.code}`}>
        <OrderContainer attributes={{
          language_code: locale?.language.code
        }}>
          <LineItemsContainer>
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
          </LineItemsContainer>
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
        </OrderContainer>
      </OrderStorage>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: [],
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  return {
    props: {
      params: params!
    }
  }
}

export default Cart

import { Container } from '#components/Container'
import { Facet } from '#components/Facet'
import { Footer } from '#components/Footer'
import { Header, HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { Props as SubNavigationProps, SubNavigation } from '#components/SubNavigation'
import { CatalogProvider, useCatalogContext } from '#contexts/CatalogContext'
import type { LocalizedProductWithVariant } from '#utils/products'
import type { NextPage } from 'next'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'

export type Props = HeaderProps & Partial<SubNavigationProps> & {
  products: LocalizedProductWithVariant[]
}

const ProductList: React.FC<{ hasSidebar: boolean }> = ({ hasSidebar }) => {
  const { products } = useCatalogContext()

  return (
    <div className={`w-full grid space-y-0 gap-6 lg:gap-y-12 sm:grid-cols-2 ${hasSidebar ? 'lg:grid-cols-2 2xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
      {
        products.map(product => (
          <ProductCard key={product.sku} product={product} />
        ))
      }
    </div>
  )
}

const Title: React.FC<Partial<SubNavigationProps>> = ({ subNavigation }) => {
  const router = useRouter()
  const { products } = useCatalogContext()
  const i18n = useI18n()

  const resultsFor = i18n.t('general.resultsFor', {
    count: products.length,
    query: typeof router.query.q === 'string' ? router.query.q : ''
  })

  return (
    <div className='flex items-center py-8 relative border-b-gray-200 border-b'>
      <h2 className='text-2xl flex-auto font-semibold text-black py-1'>{subNavigation?.current.text || resultsFor}</h2>
      <Facet />
    </div>
  )
}

export const SearchPageComponent: NextPage<Props> = ({ navigation, products, subNavigation }) => {
  // TODO: temporarily disabled subNavigation since is implemented as Facet
  // const isSubNavigationVisible = subNavigation !== undefined && subNavigation.parent.length >= 1 && subNavigation.children.length > 0
  const isSubNavigationVisible = subNavigation !== undefined && false

  return (
    <Page
      title={subNavigation?.current.text}
      description={subNavigation?.current.description}
    >
      <Container>
        <Header navigation={navigation} />

        <CatalogProvider products={products}>

          <Title subNavigation={subNavigation} />

          <div className='lg:flex mt-10'>
            {
              isSubNavigationVisible && <SubNavigation className='shrink-0 basis-1/3' subNavigation={subNavigation} />
            }

            <ProductList hasSidebar={isSubNavigationVisible} />
          </div>

        </CatalogProvider>

      </Container>

      <Footer />
    </Page>
  )
}

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

export type Props = HeaderProps & Partial<SubNavigationProps> & {
  products: LocalizedProductWithVariant[]
}

const ProductList: React.FC<{ hasSidebar: boolean }> = ({ hasSidebar }) => {
  const { products } = useCatalogContext()

  return (
    <div className={`w-full grid space-y-0 gap-6 lg:gap-y-12 sm:grid-cols-2 ${hasSidebar ? 'lg:grid-cols-2 2xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
      {
        products.map(product => (
          <ProductCard key={product.code} product={product} />
        ))
      }
    </div>
  )
}

export const SearchPageComponent: NextPage<Props> = ({ navigation, products, subNavigation }) => {
  const isSubNavigationVisible = subNavigation !== undefined && subNavigation.parent.length >= 1 && subNavigation.children.length > 0

  return (
    <Page>
      <Container>
        <Header navigation={navigation} />

        <CatalogProvider products={products}>

          <div className='flex items-center py-6 relative border-b-gray-200 border-b'>
            <h2 className='text-2xl flex-auto font-semibold text-black'>{subNavigation?.current.text || 'All Products'}</h2>
            <Facet />
          </div>

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

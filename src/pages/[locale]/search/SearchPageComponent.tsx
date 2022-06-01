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

const ProductList: React.FC = () => {
  const { products } = useCatalogContext()

  return (
    <div className='mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:gap-y-12'>
      {
        products.map(product => (
          <ProductCard key={product.code} product={product} />
        ))
      }
    </div>
  )
}

export const SearchPageComponent: NextPage<Props> = ({ navigation, products, subNavigation }) => {
  return (
    <Page>
      <Container>
        <Header navigation={navigation} />

        <CatalogProvider products={products}>
          <Facet />

          <h2 className='mt-16 block text-2xl font-semibold text-black'>{subNavigation?.current.text || 'All Products'}</h2>

          {
            subNavigation && <SubNavigation subNavigation={subNavigation} />
          }

          <ProductList />
        </CatalogProvider>

      </Container>

      <Footer />
    </Page>
  )
}

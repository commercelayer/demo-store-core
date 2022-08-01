import { Carousel } from '#components/Carousel'
import { ProductCard } from '#components/ProductCard'
import type { ProductGridPageComponent as ProductGridPageComponentType } from '#utils/pages'
import { PricesContainer } from '@commercelayer/react-components'

export const ProductGridPageComponent: React.FC<{ component: ProductGridPageComponentType }> = ({ component }) => {
  return (
    <div key={component.id} data-testid='product-grid-page-component'>
      <div className='text-2xl font-semibold mt-12 mb-6'>{component.title}</div>
      <PricesContainer>
        <Carousel
          slides={
            component.products.map(product => <ProductCard key={product.sku} product={product} />)
          }
          options={{
            slidesPerView: 1,
            breakpoints: {
              '640': {
                slidesPerView: 2
              },
              '1024': {
                slidesPerView: 3
              },
              '1280': {
                slidesPerView: 4
              },
            }
          }}
        />
      </PricesContainer>
    </div>
  )
}

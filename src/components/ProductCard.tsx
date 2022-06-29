import { Link } from '#i18n/Link'
import type { LocalizedProductWithVariant } from '#utils/products'
import { getProductUrl } from '#utils/url'
import { Price } from './Price'

export const ProductCard: React.FC<{ product: LocalizedProductWithVariant }> = ({ product }) => {
  return (
    <div className='group relative'>
      <Link href={getProductUrl(product)}>
        <a>
          <div className='relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'>
            <img src={product.images[0]} alt={product.name} className='w-full h-full object-center object-contain' />
          </div>
          <h3 className='mt-6 text-base text-black font-medium'>{product.name}</h3>
          <div className='mt-2 min-h-[1.6rem]'>
            {product.price && <Price price={product.price} />}
          </div>
        </a>
      </Link>
    </div>
  )
}

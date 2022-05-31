import { Link } from '#i18n/Link'
import type { LocalizedProductWithVariant } from '#utils/products'
import { getProductUrl } from '#utils/url'

export const ProductCard: React.FC<{ product: LocalizedProductWithVariant }> = ({ product }) => {
  return (
    <div className='group relative'>
      <div className='relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'>
        <img src={product.images[0]} alt={product.name} className='w-full h-full object-center object-contain' />
      </div>
      <h3 className='mt-6 text-md text-black font-medium'>
        <Link href={getProductUrl(product.slug)}>
          <a>
            <span className='absolute inset-0'></span>
            <p className='text-base'>{product.name}</p>
            <div className='flex items-center gap-3 mt-2'>
              <div className='line-through text-gray-400 font-light text-sm'>{product.price?.formatted_compare_at_amount}</div>
              <div className='text-black font-semibold text-base'>{product.price?.formatted_amount}</div>
            </div>
          </a>
        </Link>
      </h3>
    </div>
  )
}

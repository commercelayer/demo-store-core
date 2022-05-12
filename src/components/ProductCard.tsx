import { LocalizedProductWithVariant } from '#data/products'
import { Link } from '#i18n/Link'

export const ProductCard: React.FC<{ product: LocalizedProductWithVariant }> = ({ product }) => {
  return (
    <div className='group relative'>
      <div className='relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'>
        <img src={product.images[0]} alt={product.name} className='w-full h-full object-center object-contain' />
      </div>
      <h3 className='mt-6 text-md text-black font-medium'>
        <Link href={`/product/${product.slug}`}>
          <a>
            <span className='absolute inset-0'></span>
            {product.name}
          </a>
        </Link>
      </h3>
    </div>
  )
}

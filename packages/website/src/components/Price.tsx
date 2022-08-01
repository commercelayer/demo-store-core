import type { Price as PriceType } from '@commercelayer/sdk'

type Props = JSX.IntrinsicElements['div'] & {
  price: PriceType
}

export const Price: React.FC<Props> = ({ price, className = '', ...props }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`} { ...props }>
      {
        price.formatted_compare_at_amount &&
        price.formatted_compare_at_amount !== price.formatted_amount && (
          <div className='line-through text-gray-400 font-light text-[0.875em] leading-[1.25em]'>{price.formatted_compare_at_amount}</div>
        )
      }
      <div className={`text-black font-semibold text-[1em] leading-[1.5em]`}>{price.formatted_amount}</div>
    </div>
  )
}

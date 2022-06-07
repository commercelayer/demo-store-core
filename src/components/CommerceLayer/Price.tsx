import { PricesContainer as CLPricesContainer, Price as CLPrice } from '@commercelayer/react-components'
import { Price as PriceComponent } from '#components/Price'

type Props = JSX.IntrinsicElements['div'] & {
  code: string | undefined
}

export const Price: React.FC<Props> = ({ code, className = '', ...props }) => {
  return (
    <CLPricesContainer skuCode={code}>
      <CLPrice>
        {
          ({ prices }) => {
            const [price] = prices

            if (!price) {
              return null
            }

            return <PriceComponent price={price} className={className} { ...props } />
          }
        }
      </CLPrice>
    </CLPricesContainer>
  )
}
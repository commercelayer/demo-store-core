import { ShoppingBagOpen } from '#assets/icons'
import { Logo } from '#components/Logo'
import type { Props as NavigationProps } from '#components/Navigation'
import { Navigation } from '#components/Navigation'
import { Search } from '#components/Search'
import { Link } from '#i18n/Link'
import { getCartUrl } from '#utils/url'
import { LineItemsCount } from '@commercelayer/react-components'

export type HeaderProps = NavigationProps

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <header className='border-b-gray-200 border-b pb-6'>
      <nav className='flex items-center justify-between flex-wrap mb-4'>
        <div className='flex items-center flex-no-shrink text-white mr-6'>
          <Link href='/'><a><Logo /></a></Link>
        </div>
        <div className='flex items-center w-auto flex-grow justify-end'>
          {/* <a className='block lg:inline-block mr-4 text-gray-300'><User /></a> */}
          {/* <a className='block lg:inline-block mr-4 text-gray-300'><HeartStraight /></a> */}

          <Link href={getCartUrl()}>
            <a className='block lg:inline-block relative'>
              <ShoppingBagOpen />
              <LineItemsCount>
                {
                  ({ quantity }) => {
                    if (quantity <= 0) {
                      return null
                    }

                    return (
                      <div className='absolute bottom-0 translate-x-1/3 right-0 text-white bg-violet-400 rounded-full w-4 h-4 text-xxs flex items-center justify-center'>{quantity}</div>
                    )
                  }
                }
              </LineItemsCount>
            </a>
          </Link>
        </div>
      </nav>
      <div className='flex items-center justify-between flex-wrap gap-4 relative'>
        <Navigation navigation={navigation} className='order-2 lg:order-1' />
        <Search className='order-1 grow lg:grow-0' />
      </div>
    </header>
  )
}

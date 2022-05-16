import { HeartStraight, ShoppingBagOpen, User } from '#assets/icons'
import { Logo } from '#components/Logo'
import { Link } from '#i18n/Link'
import { getCartUrl } from '#models/url'
import { Navigation } from './Navigation'
import type { Props as NavigationProps } from './Navigation.d'
import { Search } from './Search'

export type HeaderProps = NavigationProps

export const Header: React.FC<HeaderProps> = ({ links }) => {
  return (
    <header className='border-b-gray-200 border-b pb-6 mb-6'>
      <nav className='flex items-center justify-between flex-wrap mb-4'>
        <div className='flex items-center flex-no-shrink text-white mr-6'>
          <Link href='/'><a><Logo /></a></Link>
        </div>
        <div className='flex items-center w-auto flex-grow justify-end'>
          <a className='block lg:inline-block mr-4'><User /></a>
          <a className='block lg:inline-block mr-4'><HeartStraight /></a>
          <Link href={getCartUrl()}>
            <a className='block lg:inline-block'>
              <ShoppingBagOpen />
            </a>
          </Link>
        </div>
      </nav>
      <div className='flex items-center justify-between flex-wrap'>
        <Navigation links={links} />
        <Search />
      </div>
    </header>
  )
}

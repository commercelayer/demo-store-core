import { HeartStraight, ShoppingBagOpen, User } from '#assets/icons'
import { Logo } from '#components/Logo'
import { Taxon } from '#data/catalogs'
import { Link } from '#i18n/Link'
import { Navigation } from './Navigation'

export type HeaderProps = {
  navigation: Taxon[]
}

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <header className='border-b-gray-200 border-b pb-6 mb-6'>
      <nav className='flex items-center justify-between flex-wrap mb-4'>
        <div className='flex items-center flex-no-shrink text-white mr-6'>
          <Link href='/'><a><Logo /></a></Link>
        </div>
        <div className='flex items-center w-auto flex-grow justify-end'>
          <a className='block lg:inline-block mr-4'><User /></a>
          <a className='block lg:inline-block mr-4'><HeartStraight /></a>
          <Link href='/cart'>
            <a className='block lg:inline-block'>
              <ShoppingBagOpen />
            </a>
          </Link>
        </div>
      </nav>
      <Navigation taxons={navigation} />
    </header>
  )
}

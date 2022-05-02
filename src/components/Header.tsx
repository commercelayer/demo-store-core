import { HeartStraight, ShoppingBagOpen, User } from '#assets/icons'
import { Logo } from '#components/Logo'
import { Link } from '#i18n/Link'

export const Header: React.FC = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap">
      <div className="flex items-center flex-no-shrink text-white mr-6">
        <Link href='/'><a><Logo /></a></Link>
      </div>
      <div className="flex items-center w-auto flex-grow justify-end">
        <a className="block lg:inline-block mr-4"><User /></a>
        <a className="block lg:inline-block mr-4"><HeartStraight /></a>
        <Link href='/cart'>
          <a className="block lg:inline-block">
            <ShoppingBagOpen />
          </a>
        </Link>
      </div>
    </nav>
  )
}

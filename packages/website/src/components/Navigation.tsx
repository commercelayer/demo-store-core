import { Link } from '#i18n/Link'
import type { NavigationLink } from '#utils/catalog'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Hamburger } from './Hamburger'

export type Props = JSX.IntrinsicElements['div'] & {
  navigation: NavigationLink[]
}

export const Navigation: React.FC<Props> = ({ navigation, className }) => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <div className={className}>
      <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:block lg:relative absolute right-0 top-full w-full z-10 flex-col bg-pageBackground py-4 lg:py-0`}>
        {
          navigation.map(link => {
            const isActive = router.asPath.includes(link.href)

            return (
              <Link key={link.key} href={link.href} className={`text-back font-bold py-2 px-3 my-2 mx-1 transition-colors duration-300 ${isActive ? 'bg-gray-50 rounded-md' : 'bg-transparent'}`}>
                {link.text}
              </Link>
            )
          })
        }
      </nav>
      <Hamburger className='block lg:hidden' onClick={() => setMenuOpen(v => !v)} />
    </div>
  )
}

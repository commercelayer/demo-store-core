import { Link } from '#i18n/Link'
import type { NavigationPath } from '@typings/navigation.d'
import { useState } from 'react'
import { Hamburger } from './Hamburger'

export type Props = JSX.IntrinsicElements['div'] & {
  navigation: NavigationPath
}

export const Navigation: React.FC<Props> = ({ navigation, className }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <div className={className}>
      <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:block lg:relative absolute right-0 top-full w-full z-10 flex-col bg-white py-4 lg:py-0`}>
        {
          navigation.children.map(link => (
            <Link key={link.key} href={link.href}><a className='text-back font-bold p-2 m-2'>{link.text}</a></Link>
          ))
        }
      </nav>
      <Hamburger className='block lg:hidden' onClick={() => {
        console.log('clicked')
        setMenuOpen(v => !v)
      }} />
    </div>
  )
}

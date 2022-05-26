import { Link } from '#i18n/Link'
import type { NavigationPath } from '@typings/navigation.d'

export type Props = {
  navigation: NavigationPath
}

export const Navigation: React.FC<Props> = ({ navigation }) => {
  return (
    <nav>
      {
        navigation.children.map(link => (
          <Link key={link.key} href={link.href}><a className='text-back font-bold p-2 m-2'>{link.text}</a></Link>
        ))
      }
    </nav>
  )
}

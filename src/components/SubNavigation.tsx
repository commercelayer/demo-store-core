import { Link } from '#i18n/Link'
import { NavigationPath } from './Navigation.d'

export type Props = {
  subNavigation: NavigationPath
}

export const SubNavigation: React.FC<Props> = ({ subNavigation }) => {
  return (
    <nav>
      <div>
        {
          subNavigation.parent.map(link => (
            <Link key={link.key} href={link.href}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{link.text}</a></Link>
          ))
        }
      </div>

      <div>
        {
          subNavigation.children.map(link => {
            return (
              <Link key={link.key} href={link.href}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{link.text}</a></Link>
            )
          })
        }
      </div>
    </nav>
  )
}

import { Link } from '#i18n/Link'
import type { Props } from './Navigation.d'

export const Navigation: React.FC<Props> = ({ links }) => {
  return (
    <nav>
      {
        links.map(link => (
          <Link key={link.key} href={link.href}><a className='text-back font-bold p-2 m-2'>{link.text}</a></Link>
        ))
      }
    </nav>
  )
}

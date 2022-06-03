import { Link } from '#i18n/Link'
import type { NavigationPath } from '@typings/navigation.d'

export type Props = JSX.IntrinsicElements['nav'] & {
  subNavigation: NavigationPath
}

export const SubNavigation: React.FC<Props> = ({ className , subNavigation: { parent, children }, ...props }) => {
  return (
    <nav className={className} {...props}>
      <div>
        {
          parent.map(link => (
            <Link key={link.key} href={link.href}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{link.text}</a></Link>
          ))
        }
      </div>

      <div>
        {
          children.map(link => {
            return (
              <Link key={link.key} href={link.href}><a className='bg-gray-100 mx-2 rounded py-1 px-2'>{link.text}</a></Link>
            )
          })
        }
      </div>
    </nav>
  )
}

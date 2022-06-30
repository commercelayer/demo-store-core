import { Link } from '#i18n/Link'
import type { NavigationPath, NavigationLink } from '@typings/navigation.d'

export type Props = JSX.IntrinsicElements['nav'] & {
  subNavigation: NavigationPath
}

const NavLink: React.FC<{ key: string, link: NavigationLink, active: NavigationLink }> = ({ key, link, active }) => {
  return (
    <div key={key}>
      <Link href={link.href}><a className={`block mx-2 py-2 px-2 border-b border-b-gray-100 transition-colors ${active.key === link.key ? 'bg-black text-white' : 'bg-transparent'}`}>{link.text}</a></Link>
      {
        link.children?.map(subLink => (
          <NavLink key={subLink.key} link={subLink} active={active} />
        ))
      }
    </div>
  )
}

export const SubNavigation: React.FC<Props> = ({ className , subNavigation: { current, children }, ...props }) => {
  return (
    <nav className={className} {...props}>
      <div>
        {
          children.map(link => {
            return (
              <NavLink key={link.key} link={link} active={current} />
            )
          })
        }
      </div>
    </nav>
  )
}

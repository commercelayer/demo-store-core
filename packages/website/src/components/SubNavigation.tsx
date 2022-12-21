import { Link } from '#i18n/Link'
import type { Navigation, NavigationLink } from '#utils/catalog'
import { useI18n } from 'next-localization'

export type Props = JSX.IntrinsicElements['nav'] & {
  subNavigation: Navigation
}

const NavLink: React.FC<{ link: NavigationLink, active: NavigationLink, level: number }> = ({ link, active, level }) => {
  const i18n = useI18n()

  return (
    <div>
      <Link href={link.href} className={`block mx-2 py-3 px-3 border-b border-b-gray-100 tracking-wide transition-colors ${active.key === link.key ? 'bg-black text-white' : 'bg-transparent text-gray-500'}`}>
        {level === 1 ? <span className='uppercase'>{i18n.t('general.all') }</span> : link.text}
      </Link>
      {
        link.children?.map(subLink => (
          <NavLink key={subLink.key} link={subLink} active={active} level={++level} />
        ))
      }
    </div>
  )
}

export const SubNavigation: React.FC<Props> = ({ className , subNavigation: { current, path: children }, ...props }) => {
  return (
    <nav className={className} {...props}>
      {
        children.map(link => {
          return (
            <NavLink key={link.key} link={link} active={current} level={1} />
          )
        })
      }
    </nav>
  )
}

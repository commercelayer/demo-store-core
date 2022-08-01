import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useRouter } from 'next/router'
import type { UrlObject } from 'url'

declare type Url = string | UrlObject;

type LinkProps = Omit<NextLinkProps, 'locale' | 'href'>
  & (
    | { href: Url }
    | { locale: string }
  )

function isUrlAbsolute(url: string) {
  return (url.indexOf('://') > 0 || url.indexOf('//') === 0)
}

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  const router = useRouter()

  if ('locale' in props) {
    const { locale, ...otherProps } = props

    if (router.pathname === '/') {
      return <NextLink {...otherProps} href={`/${locale}`}>{children}</NextLink>
    }

    if (locale === '') {
      return <NextLink {...otherProps} href='/'>{children}</NextLink>
    }

    return <NextLink {...otherProps} href={{
      query: { ...router.query, locale },
    }}>{children}</NextLink>
  }

  if (isUrlAbsolute(props.href.toString())) {
    return <NextLink href={props.href}>{children}</NextLink>
  }

  const locale = router.query.locale || ''

  return <NextLink href={`/${locale}${props.href}`.replace(/^\/\//, '')}>{children}</NextLink>
}

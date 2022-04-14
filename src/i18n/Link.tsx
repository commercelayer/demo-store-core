import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { UrlObject } from 'url'

declare type Url = string | UrlObject;

type LinkProps = Omit<NextLinkProps, 'locale' | 'href'>
  & (
    | { href: Url }
    | { locale: string }
  )

export const Link: FC<LinkProps> = ({ children, ...props }) => {
  const router = useRouter()

  if ('locale' in props) {
    if (router.pathname === '/') {
      return <NextLink {...props} href={`/${props.locale}`}>{children}</NextLink>
    }

    return <NextLink {...props} href={{
      pathname: router.pathname,
      query: { ...router.query, locale: props.locale },
    }}>{children}</NextLink>
  }

  const locale = router.query.locale || ''

  return <NextLink href={`/${locale}${props.href}`.replace(/^\/\//, '')}>{children}</NextLink>
}

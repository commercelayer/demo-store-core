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

  const locale = router.query.locale || ''

  return <NextLink href={`/${locale}${props.href}`.replace(/^\/\//, '')}>{children}</NextLink>
}

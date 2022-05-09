import { Link } from "#i18n/Link";
import { changeLanguage } from '#i18n/locale'
import { useRouter } from "next/router";
import { FC } from "react";
import { Container } from './Container'

export const Footer: FC = () => {
  const router = useRouter()

  return (
    <div className="p-16 mt-8 bg-gray-800 text-white">
      <Container>

        <Link locale=''>
          <a>Country Selector</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link locale={changeLanguage(router.query.locale, 'en')} scroll={false}>
          <a>English</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link locale={changeLanguage(router.query.locale, 'it')} scroll={false}>
          <a>Italiano</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link href='/search'>
          <a>All Products</a>
        </Link>

      </Container>
    </div>
  )
}
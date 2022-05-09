import { Link } from "#i18n/Link";
import { changeLanguage } from '#i18n/locale'
import { useRouter } from "next/router";
import { FC } from "react";

export const Navigation: FC = () => {
  const router = useRouter()

  return (
    <div>

      <p>
        <Link locale=''>
          <a>Country Selector</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link locale={changeLanguage(router.query.locale, 'en')}>
          <a>English</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link locale={changeLanguage(router.query.locale, 'it')}>
          <a>Italiano</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link href='/search'>
          <a>All Products</a>
        </Link>
      </p>

    </div>
  )
}
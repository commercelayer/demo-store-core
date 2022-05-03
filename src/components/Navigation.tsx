import { Link } from "#i18n/Link";
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

        {
          router?.pathname !== '/' && (
            <>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link locale={(router?.query?.locale as string)?.replace(/[it|en]+\-/, 'en-')}>
                <a>English</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link locale={(router?.query?.locale as string)?.replace(/[it|en]+\-/, 'it-')}>
                <a>Italiano</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/search'>
                <a>All Products</a>
              </Link>
            </>
          )
        }
      </p>

    </div>
  )
}
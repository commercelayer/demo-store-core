import { countries } from "#data/countries";
import { languages } from "#data/languages";
import { Link } from "#i18n/Link";
import { makeLocaleCode } from "#i18n/locale";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";

export const CountrySelector: FC = () => {
  const router = useRouter()

  return (
    <div>
      <p>Country Selector</p>

      <p>
        <Link href='/'>
          <a>Home</a>
        </Link>

        {
          router?.pathname !== '/' && (
            <>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/another'>
                <a>Another Page</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/1'>
                <a>Page 1</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/1/other'>
                <a>Page 1 - other</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/2'>
                <a>Page 2</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/2/other'>
                <a>Page 2 - other</a>
              </Link>
            </>
          )
        }
      </p>

      {
        countries.map(country => (
          <Fragment key={country.code}>
            <Link locale={makeLocaleCode(country.code, country.default_language)}>
              <a>{country.name}</a>
            </Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </Fragment>
        ))
      }

      {
        languages.map(language => (
          <span key={language.code}>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link locale={language.code}>
              <a>International ({language.name})</a>
            </Link>
          </span>
        ))
      }

    </div>
  )
}
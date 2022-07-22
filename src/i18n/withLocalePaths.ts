import { combine } from '#utils/collection'
import type { GetStaticPathsResult } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import { getLocales, Locale } from './locale'

// @ts-expect-error
type WithoutLocalePathsResult<P extends Partial<ParsedUrlQuery>> = GetStaticPathsResult<P>

type WithLocalePathsResult<P extends Partial<ParsedUrlQuery>> = GetStaticPathsResult<P & { locale: string }>

type Props<P extends Partial<ParsedUrlQuery>> = WithoutLocalePathsResult<P> | ((localeCode: string) => WithoutLocalePathsResult<P> | Promise<WithoutLocalePathsResult<P>>)

const appendLocaleToPath = <P extends Partial<ParsedUrlQuery>>(locale: Locale, path: WithoutLocalePathsResult<P>['paths'][number]): WithLocalePathsResult<P>['paths'][number] => {
  if (typeof path === 'string') {
    return `/${locale.code}${path}`
  }

  return {
    ...path,
    params: {
      ...path.params,
      locale: locale.code
    }
  }
}

export const withLocalePaths = async <P extends Partial<ParsedUrlQuery>>(getStaticPathsResult: Props<P>, locales?: Locale[]): Promise<WithLocalePathsResult<P>> => {
  if (!locales) {
    locales = await getLocales()
  }

  if (locales.length === 0) {
    throw new Error('At least one Locale is mandatory!')
  }

  if (typeof getStaticPathsResult === 'function') {
    const withLocalePathsResult: WithLocalePathsResult<P>[] = await Promise.all(
      locales.map(async locale => {
        const { fallback, paths } = await getStaticPathsResult(locale.code)

        return {
          fallback,
          paths: paths.map(path => appendLocaleToPath(locale, path))
        }
      })
    )

    const result = withLocalePathsResult.reduce((acc, cv) => {
      return {
        fallback: acc.fallback || cv.fallback,
        paths: [
          ...(acc.paths || []),
          ...cv.paths
        ]
      }
    }, {} as WithLocalePathsResult<P>)

    if (result.paths.length === 0) {
      return {
        // @ts-expect-error
        paths: locales.map(locale => ({
          params: {
            locale: locale.code
          }
        })),
        fallback: result.fallback
      }
    }

    return result
  }

  const { fallback, paths } = getStaticPathsResult

  if (paths.length === 0) {
    return {
      // @ts-expect-error
      paths: locales.map(locale => ({
        params: {
          locale: locale.code
        }
      })),
      fallback
    }
  }

  const newPaths: WithLocalePathsResult<P>['paths'][number][] = combine<
    Locale,
    WithoutLocalePathsResult<P>['paths'][number],
    WithLocalePathsResult<P>['paths'][number]
    >(locales, paths, appendLocaleToPath)

  return {
    paths: newPaths,
    fallback,
  }
}

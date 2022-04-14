import { GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Locale, locales as allLocales } from './locale'
import { combine } from './utils'

type WithLocalePathsResult<P> = GetStaticPathsResult<P & { locale: string }>

export const withLocalePaths = <P extends ParsedUrlQuery>({ fallback, paths }: GetStaticPathsResult<P>, locales: Locale[] = allLocales): WithLocalePathsResult<P> => {
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

  const newNewPaths = combine<
    Locale,
    GetStaticPathsResult<P>['paths'][number],
    WithLocalePathsResult<P>['paths'][number]
  >(locales, paths, (locale, path) => {

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
  })

  return {
    paths: newNewPaths,
    fallback,
  }
}
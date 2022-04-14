import { Country } from '#data/countries'
import { Language } from '#data/languages'
import { GetStaticPathsResult } from 'next'
import { Locale, locales } from './locale'
import { withLocalePaths } from './withLocalePaths'

const unitedStates: Country = { code: 'US', default_language: 'en', market: 400, name: 'United States' }
const italy: Country = { code: 'IT', default_language: 'it', market: 401, name: 'Italy' }
const italian: Language = { code: 'it', name: 'Italiano' }
const english: Language = { code: 'en', name: 'English' }

const itUS: Locale = { "code": "it-us", "country": unitedStates, "language": italian }
const enIT: Locale = { "code": "en-it", "country": italy, "language": english }
const en: Locale = { "code": "en", "language": english }

test('should do nothing when not locales are passed', () => {
  const getStaticPathsResult: GetStaticPathsResult = {
    fallback: 'blocking',
    paths: []
  }

  const withLocales = withLocalePaths(getStaticPathsResult, [])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: []
  })
})

test('should add all given locales without any other param when "paths" is empty', () => {
  const getStaticPathsResult: GetStaticPathsResult = {
    fallback: 'blocking',
    paths: []
  }

  const withLocales = withLocalePaths(getStaticPathsResult, [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      { params: { locale: 'it-us' } },
      { params: { locale: 'en-it' } },
      { params: { locale: 'en' } },
    ]
  })
})

test('should combine all given params with all given locales', () => {
  const getStaticPathsResult: GetStaticPathsResult<{ pid: string }> = {
    fallback: 'blocking',
    paths: [
      { params: { pid: '1' } },
      { params: { pid: '2' } }
    ]
  }

  const withLocales = withLocalePaths(getStaticPathsResult, [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      { params: { pid: '1', locale: 'it-us' } },
      { params: { pid: '2', locale: 'it-us' } },
      { params: { pid: '1', locale: 'en-it' } },
      { params: { pid: '2', locale: 'en-it' } },
      { params: { pid: '1', locale: 'en' } },
      { params: { pid: '2', locale: 'en' } },
    ]
  })
})

test('should combine all given string paths with all given locales', () => {
  const getStaticPathsResult: GetStaticPathsResult<{ name: string }> = {
    fallback: 'blocking',
    paths: [
      '/products/1',
      '/products/2',
    ]
  }

  const withLocales = withLocalePaths(getStaticPathsResult, [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      '/it-us/products/1',
      '/it-us/products/2',
      '/en-it/products/1',
      '/en-it/products/2',
      '/en/products/1',
      '/en/products/2',
    ]
  })
})

test('should combine all given string paths with all configured locales', () => {
  const getStaticPathsResult: GetStaticPathsResult<{ name: string }> = {
    fallback: 'blocking',
    paths: [
      '/products/1',
      '/products/2',
    ]
  }

  const withLocales = withLocalePaths(getStaticPathsResult)

  expect(withLocales.paths.length).toEqual(locales.length * 2)
})

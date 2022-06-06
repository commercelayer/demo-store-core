import type { RawDataCountry } from '#data/countries'
import type { RawDataLanguage } from '#data/languages'
import type { GetStaticPathsResult } from 'next'
import { Locale, locales } from './locale'
import { withLocalePaths } from './withLocalePaths'

const unitedStates: RawDataCountry = { code: 'US', default_language: 'en', market: 1234, name: 'United States', region: 'Americas', catalog: 'AMER' }
const italy: RawDataCountry = { code: 'IT', default_language: 'it', market: 9876, name: 'Italy', region: 'Europe', catalog: 'EMEA' }
const italian: RawDataLanguage = { code: 'it', name: 'Italiano', catalog: 'AMER' }
const english: RawDataLanguage = { code: 'en', name: 'English', catalog: 'AMER' }

const itUS: Locale = { "code": "it-us", "country": unitedStates, "language": italian }
const enIT: Locale = { "code": "en-it", "country": italy, "language": english }
const en: Locale = { "code": "en", "language": english }

test('should throw an error when not locales are passed', () => {
  expect(() => withLocalePaths<{ pid: string }>({
    fallback: 'blocking',
    paths: [
      { params: { pid: '1' } },
      { params: { pid: '2' } }
    ]
  }, [])).toThrowError(new Error('At least one Locale is mandatory!'))
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

test('should add all given locales without any other param when "paths" is empty using a callback method', () => {
  const getStaticPathsResult = (): GetStaticPathsResult => ({
    fallback: 'blocking',
    paths: []
  })

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
  const withLocales = withLocalePaths<{ pid: string }>({
    fallback: 'blocking',
    paths: [
      { params: { pid: '1' } },
      { params: { pid: '2' } }
    ]
  }, [itUS, enIT, en])

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

test('should combine all given params with all given locales using a callback method', () => {
  const withLocales = withLocalePaths<{ pid: string }>((locale) => ({
    fallback: 'blocking',
    paths: [
      { params: { pid: `${locale}-1` } },
      { params: { pid: `${locale}-2` } }
    ]
  }), [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      { params: { pid: 'it-us-1', locale: 'it-us' } },
      { params: { pid: 'it-us-2', locale: 'it-us' } },
      { params: { pid: 'en-it-1', locale: 'en-it' } },
      { params: { pid: 'en-it-2', locale: 'en-it' } },
      { params: { pid: 'en-1', locale: 'en' } },
      { params: { pid: 'en-2', locale: 'en' } },
    ]
  })
})

test('should combine all given string paths with all given locales', () => {
  const withLocales = withLocalePaths<{ name: string }>({
    fallback: 'blocking',
    paths: [
      '/products/1',
      '/products/2',
    ]
  }, [itUS, enIT, en])

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

test('should combine all given string paths with all given locales using a callback method', () => {
  const withLocales = withLocalePaths<{ pid: string }>((locale) => ({
    fallback: 'blocking',
    paths: [
      `/products/${locale}-1`,
      `/products/${locale}-2`,
    ]
  }), [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      '/it-us/products/it-us-1',
      '/it-us/products/it-us-2',
      '/en-it/products/en-it-1',
      '/en-it/products/en-it-2',
      '/en/products/en-1',
      '/en/products/en-2',
    ]
  })
})

test('should combine all given string paths with all configured locales', () => {
  const withLocales = withLocalePaths<{ name: string }>({
    fallback: 'blocking',
    paths: [
      '/products/1',
      '/products/2',
    ]
  })

  expect(withLocales.paths.length).toEqual(locales.length * 2)
})

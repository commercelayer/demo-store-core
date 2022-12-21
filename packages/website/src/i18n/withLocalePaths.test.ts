import type { ShoppableCountry } from '#utils/countries'
import type { RawDataLanguage } from '@commercelayer/demo-store-types'
import type { GetStaticPathsResult } from 'next'
import { getLocales, NonShoppableLocale, ShoppableLocale } from './locale'
import { withLocalePaths } from './withLocalePaths'

jest.mock('#data/languages', () => ({
  getRawDataLanguages: () => ([
    {
      "name": "English",
      "code": "en",
      "catalog": "AMER"
    },
    {
      "name": "Italiano",
      "code": "it",
      "catalog": "AMER"
    }
  ])
}))

const unitedStates: ShoppableCountry = { code: 'US', languages: ['en'], market: 1234, name: 'United States', region: 'Americas', catalog: 'AMER' }
const italy: ShoppableCountry = { code: 'IT', languages: ['it'], market: 9876, name: 'Italy', region: 'Europe', catalog: 'EMEA' }
const italian: RawDataLanguage = { code: 'it', name: 'Italiano', catalog: 'AMER' }
const english: RawDataLanguage = { code: 'en', name: 'English', catalog: 'AMER' }

const itUS: ShoppableLocale = { code: 'it-us', isShoppable: true, country: unitedStates, language: italian }
const enIT: ShoppableLocale = { code: 'en-it', isShoppable: true, country: italy, language: english }
const en: NonShoppableLocale = { code: 'en', isShoppable: false, language: english }

test('should throw an error when not locales are passed', () => {
  expect(() => withLocalePaths<{ pid: string }>({
    fallback: 'blocking',
    paths: [
      { params: { pid: '1' } },
      { params: { pid: '2' } }
    ]
  }, [])).rejects.toThrowError(new Error('At least one Locale is mandatory!'))
})

test('should add all given locales without any other param when "paths" is empty', async () => {
  const getStaticPathsResult: GetStaticPathsResult = {
    fallback: 'blocking',
    paths: []
  }

  const withLocales = await withLocalePaths(getStaticPathsResult, [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      { params: { locale: 'it-us' } },
      { params: { locale: 'en-it' } },
      { params: { locale: 'en' } },
    ]
  })
})

test('should add all given locales without any other param when "paths" is empty using a callback method', async () => {
  const getStaticPathsResult = (): GetStaticPathsResult => ({
    fallback: 'blocking',
    paths: []
  })

  const withLocales = await withLocalePaths(getStaticPathsResult, [itUS, enIT, en])

  expect(withLocales).toStrictEqual<typeof withLocales>({
    fallback: 'blocking',
    paths: [
      { params: { locale: 'it-us' } },
      { params: { locale: 'en-it' } },
      { params: { locale: 'en' } },
    ]
  })
})

test('should combine all given params with all given locales', async () => {
  const withLocales = await withLocalePaths<{ pid: string }>({
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

test('should combine all given params with all given locales using a callback method', async () => {
  const withLocales = await withLocalePaths<{ pid: string }>((locale) => ({
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

test('should combine all given string paths with all given locales', async () => {
  const withLocales = await withLocalePaths<{ name: string }>({
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

test('should combine all given string paths with all given locales using a callback method', async () => {
  const withLocales = await withLocalePaths<{ pid: string }>((locale) => ({
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

test('should combine all given string paths with all configured locales', async () => {
  const withLocales = await withLocalePaths<{ name: string }>({
    fallback: 'blocking',
    paths: [
      '/products/1',
      '/products/2',
    ]
  })

  const allLocales = await getLocales()

  expect(withLocales.paths.length).toEqual(allLocales.length * 2)
})

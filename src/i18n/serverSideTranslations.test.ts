import { serverSideTranslations } from './serverSideTranslations'
import mock from 'mock-fs'

const mockedFolder = 'mock/data/locales/'

type LocaleFile = {
  [file: string]: {
    [key: string]: any
  }
}

const mockLocaleFiles = (localeFiles: LocaleFile[]) => {

  const stringifiedLocaleFiles = localeFiles.flatMap(
    localFile => Object.entries(localFile)
      .map(([locale, data]) => ([`${locale}.json`, JSON.stringify(data)]))
  )

  mock({
    [`data/${mockedFolder}`]: Object.fromEntries(stringifiedLocaleFiles)
  })
}

afterEach(() => {
  mock.restore()
})

test('should return an empty dictionary when translations are not found', async () => {
  mockLocaleFiles([])
  const lngDict = await serverSideTranslations('it', mockedFolder)

  expect(lngDict).toStrictEqual({
    lngDict: {}
  })
})

test('should return all translations for selected locale', async () => {
  mockLocaleFiles([
    {
      'en': {
        general: {
          title: 'English title',
          subtitle: {
            primary: 'primary subtitle',
            secondary: 'secondary subtitle'
          }
        }
      }
    },
    {
      'it': {
        general: {
          title: 'Titolo in italiano',
          subtitle: {
            primary: 'sottotitolo primario',
            secondary: 'sottotitolo secondario'
          }
        }
      }
    },
  ])

  const lngDict = await serverSideTranslations('en', mockedFolder)

  expect(lngDict).toStrictEqual({
    lngDict: {
      general: {
        title: 'English title',
        subtitle: {
          primary: 'primary subtitle',
          secondary: 'secondary subtitle'
        }
      }
    }
  })
})

test('should return all translations with a fallback to locale language for selected locale', async () => {
  mockLocaleFiles([
    {
      'en': {
        general: {
          title: 'English title',
          subtitle: {
            primary: 'primary subtitle',
            secondary: 'secondary subtitle'
          }
        }
      }
    },
    {
      'it': {
        general: {
          title: 'Titolo in italiano',
          subtitle: {
            primary: 'sottotitolo primario',
            secondary: 'sottotitolo secondario'
          }
        }
      }
    },
    {
      'en-us': {
        general: {
          subtitle: {
            default: 'default subtitle',
            secondary: '2nd subtitle'
          }
        }
      }
    },
  ])

  const lngDict = await serverSideTranslations('en-us', mockedFolder)

  expect(lngDict).toStrictEqual({
    lngDict: {
      general: {
        title: 'English title',
        subtitle: {
          default: 'default subtitle',
          primary: 'primary subtitle',
          secondary: '2nd subtitle'
        }
      }
    }
  })
})

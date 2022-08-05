import { serverSideTranslations } from './serverSideTranslations'
import * as dataUtils from '../utils/data'

jest.mock('../utils/data', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../utils/data')
  }
})

const mockedFetchData = jest.spyOn(dataUtils, 'fetchLocaleData')

type LocaleFile = {
  [filename: string]: unknown
}

const mockLocaleFiles = (localeFiles: LocaleFile) => {
  mockedFetchData.mockImplementation(async (filename: string) => localeFiles[filename])
}

afterEach(() => {
  mockedFetchData.mockReset()
})

test('should return an empty dictionary when translations are not found', async () => {
  mockLocaleFiles({})
  const lngDict = await serverSideTranslations('it')

  expect(lngDict).toStrictEqual({
    lngDict: {}
  })
})

test('should return all translations for selected locale', async () => {
  mockLocaleFiles({
    'en': {
      general: {
        title: 'English title',
        subtitle: {
          primary: 'primary subtitle',
          secondary: 'secondary subtitle'
        }
      }
    },
    'it': {
      general: {
        title: 'Titolo in italiano',
        subtitle: {
          primary: 'sottotitolo primario',
          secondary: 'sottotitolo secondario'
        }
      }
    }
  })

  const lngDict = await serverSideTranslations('en')

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
  mockLocaleFiles({
    'en': {
      general: {
        title: 'English title',
        subtitle: {
          primary: 'primary subtitle',
          secondary: 'secondary subtitle'
        }
      }
    },
    'it': {
      general: {
        title: 'Titolo in italiano',
        subtitle: {
          primary: 'sottotitolo primario',
          secondary: 'sottotitolo secondario'
        }
      }
    },
    'en-us': {
      general: {
        subtitle: {
          default: 'default subtitle',
          secondary: '2nd subtitle'
        }
      }
    }
  })

  const lngDict = await serverSideTranslations('en-us')

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

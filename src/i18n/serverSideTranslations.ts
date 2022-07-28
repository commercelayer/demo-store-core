import { fetchData } from '#utils/data'
import memoize from 'lodash/memoize'
import lMerge from 'lodash/merge'

export const serverSideTranslations = memoize(
  async (locale: string, path: string = 'locales') => {
    const [language] = locale.split('-')

    const languageDictionary = await fetchData(language, path).catch(_error => ({}))
    const localeDictionary = await fetchData(locale, path).catch(_error => ({}))

    return {
      lngDict: lMerge(languageDictionary, localeDictionary)
    }
  },
  (locale, path) => `${locale}-${path}`
)

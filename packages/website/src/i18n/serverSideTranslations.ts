import { fetchLocaleData } from '#utils/data'
import { memoize } from '#utils/memoize'
import lMerge from 'lodash/merge'

export const serverSideTranslations = memoize(
  async (locale: string) => {
    const [language] = locale.split('-')

    const languageDictionary = await fetchLocaleData(language).catch(_error => ({}))
    const localeDictionary = await fetchLocaleData(locale).catch(_error => ({}))

    return {
      lngDict: lMerge(languageDictionary, localeDictionary)
    }
  }
)

import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import lMerge from 'lodash/merge'

export const serverSideTranslations = async (locale: string, path: string = 'data/locales/') => {
  const [language] = locale.split('-')

  const projectRoot = process.cwd()
  const languageFile = resolve(projectRoot, path, `${language}.json`)
  const localeFile = resolve(projectRoot, path, `${locale}.json`)

  const languageDictionary = existsSync(languageFile) ? JSON.parse(readFileSync(languageFile, { encoding: 'utf-8' })) : {}
  const localeDictionary = existsSync(localeFile) ? JSON.parse(readFileSync(localeFile, { encoding: 'utf-8' })) : {}

  return {
    lngDict: lMerge(languageDictionary, localeDictionary)
  }
}

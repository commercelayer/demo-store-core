import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'


export const serverSideTranslations = async (locale: string, path: string = 'public/locales/') => {
  const [language] = locale.split('-')

  const projectRoot = resolve(__dirname, '../../../')
  const languageFile = resolve(projectRoot, path, `${language}.json`)
  const localeFile = resolve(projectRoot, path, `${locale}.json`)

  const languageDictionary = existsSync(languageFile) ? JSON.parse(readFileSync(languageFile, { encoding: 'utf-8' })) : {}
  const localeDictionary = existsSync(localeFile) ? JSON.parse(readFileSync(localeFile, { encoding: 'utf-8' })) : {}

  return {
    lngDict: {
      ...languageDictionary,
      ...localeDictionary
    }
  }
}
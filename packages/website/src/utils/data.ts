import { isSupportedUrl } from '#utils/isSupportedUrl'

/**
 * Fetch JSON from `data` folder.
 * @param filename JSON filename that will be fetched.
 */
export async function fetchJsonData(filename: string): Promise<unknown> {
  let data: unknown

  if (isSupportedUrl(process.env.NEXT_PUBLIC_JSON_DATA_FOLDER)) {
    data = fetch(`${process.env.NEXT_PUBLIC_JSON_DATA_FOLDER}/${filename}.json`)
      .then(response => response.json())
      .catch(error => {
        console.error(`Cannot fetch "${process.env.NEXT_PUBLIC_JSON_DATA_FOLDER}/${filename}.json"`, error)
        return null
      })
  } else {
    data = (await import(`aliasJsonData/${filename}.json`)).default
  }

  return data
}


/**
 * Fetch LOCALE from `data` folder.
 * @param filename JSON filename that will be fetched.
 */
export async function fetchLocaleData(filename: string): Promise<unknown> {
  let data: unknown

  if (isSupportedUrl(process.env.NEXT_PUBLIC_LOCALE_DATA_FOLDER)) {
    data = fetch(`${process.env.NEXT_PUBLIC_LOCALE_DATA_FOLDER}/${filename}.json`)
      .then(response => response.json())
      .catch(error => {
        console.error(`Cannot fetch "${process.env.NEXT_PUBLIC_LOCALE_DATA_FOLDER}/${filename}.json"`, error)
        return null
      })
  } else {
    data = (await import(`aliasLocaleData/${filename}.json`)).default
  }

  return data
}

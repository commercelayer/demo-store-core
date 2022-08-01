function isUrlAbsolute(url: string) {
  return (url.indexOf('://') > 0 || url.indexOf('//') === 0)
}

/**
 * Fetch JSON from `data` folder.
 * @param filename JSON filename that will be fetched.
 * @param jsonDataFolder Local path starting from `./data/` or a remote URL.
 */
export async function fetchData(filename: string, jsonDataFolder: string = process.env.NEXT_PUBLIC_JSON_DATA_FOLDER || 'json'): Promise<unknown> {
  let jsonData: unknown

  if (isUrlAbsolute(jsonDataFolder)) {
    jsonData = fetch(`${jsonDataFolder}/${filename}.json`)
      .then(response => response.json())
      .catch(error => {
        console.error(`Cannot fetch "${jsonDataFolder}/${filename}.json"`, error)
        return null
      })
  } else {
    jsonData = (await import(`${process.env.PROJECT_ROOT}/data/${jsonDataFolder}/${filename}.json`)).default
  }

  return jsonData
}

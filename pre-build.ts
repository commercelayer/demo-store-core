

import { getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { locales } from '#i18n/locale'
// import { mkdirSync, writeFileSync } from 'fs'
// import { resolve } from 'path'

import { redisClient } from '#utils/redis'

(async () => {
  const client = await redisClient()
  
  await Promise.all(
    locales.map((locale) => {
      const catalog = getCatalog(locale, rawDataProducts)
  
      return client.set(locale.code, JSON.stringify(catalog.data))
  
      // mkdirSync(resolve(__dirname, 'data', 'json', 'catalog'), { recursive: true })
      // writeFileSync(resolve(__dirname, 'data', 'json', 'catalog', `${locale.code}.json`), JSON.stringify(catalog.data, undefined, 2))
    })
  )

  await client.disconnect()
})()


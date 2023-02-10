import { resolve } from 'path'
import { test } from 'uvu'
import { type } from 'uvu/assert'
import {
  rawDataCatalogs_schema,
  rawDataCountries_schema,
  rawDataLanguages_schema,
  rawDataOrganization_schema,
  rawDataPages_schema,
  rawDataProducts_schema,
  rawDataTaxonomies_schema,
  rawDataTaxons_schema
} from '..'

async function importJson(...paths: string[]) {
  return (await import(resolve(...paths))).default
}

export function testJsonData(path: string) {
  test('"catalog.json" should be properly defined.', async () => {
    const result = rawDataCatalogs_schema.parse(await importJson(path, 'catalogs.json'))
    type(result,'object')
  })

  test('"countries.json" should be properly defined.', async () => {
    const result = rawDataCountries_schema.parse(await importJson(path, 'countries.json'))
    type(result, 'object')
  })

  test('"languages.json" should be properly defined.', async () => {
    const result = rawDataLanguages_schema.parse(await importJson(path, 'languages.json'))
    type(result, 'object')
  })

  test('"organization.json" should be properly defined.', async () => {
    const result = rawDataOrganization_schema.parse(await importJson(path, 'organization.json'))
    type(result, 'object')
  })

  test('"pages.json" should be properly defined.', async () => {
    const result = rawDataPages_schema.parse(await importJson(path, 'pages.json'))
    type(result, 'object')
  })

  test('"products.json" should be properly defined.', async () => {
    const result = rawDataProducts_schema.parse(await importJson(path, 'products.json'))
    type(result, 'object')
  })

  test('"taxonomies.json" should be properly defined.', async () => {
    const result = rawDataTaxonomies_schema.parse(await importJson(path, 'taxonomies.json'))
    type(result, 'object')
  })

  test('"taxons.json" should be properly defined.', async () => {
    const result = rawDataTaxons_schema.parse(await importJson(path, 'taxons.json'))
    type(result, 'object')
  })

  test.run()
}

// const path = process.argv[2]

// if (!path || !existsSync(path)) {
//   throw new Error(`Folder "${path}" doesn't exist!`)
// }

// run(path)

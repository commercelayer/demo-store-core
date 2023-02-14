import at from 'lodash/at'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { resolve } from 'path'
import { suite, Test } from 'uvu'
import { equal, is } from 'uvu/assert'
import type { ZodTypeAny } from 'zod'
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

function green(test: Test) {
  test('', () => {
    is(true, true)
  })
}

export function testJsonData(path: string) {
  test('catalogs.json', rawDataCatalogs_schema)
  test('countries.json', rawDataCountries_schema)
  test('languages.json', rawDataLanguages_schema)
  test('organization.json', rawDataOrganization_schema)
  test('pages.json', rawDataPages_schema)
  test('products.json', rawDataProducts_schema)
  test('taxonomies.json', rawDataTaxonomies_schema)
  test('taxons.json', rawDataTaxons_schema)

  async function test(filename: `${string}.json`, schema: ZodTypeAny) {
    const suiteName = filename
    // const suiteName = `'${filename}' should be properly defined.`
    const json = await importJson(path, filename)
    const result = schema.safeParse(json)

    const test = suite(suiteName)

    if (result.success === true) {
      green(test)
    } else {
      result.error.issues.forEach(issue => {
        // @ts-expect-error
        const expectedType = issue.expected ? ` - Expected type '${issue.expected}'` : ''

        const testName = `Path '${issue.path.join('.')}' - ${issue.message}${expectedType}`

        test(testName, () => {
          const actual = at(json, [issue.path[0]!])[0]

          const expected = cloneDeep(actual)

          set(
            expected,
            issue.path.slice(1),
            `ERROR - ${issue.message}${expectedType}`
          )

          equal(actual, expected, ' ')
        })
      })
    }

    test.run()
  }
}

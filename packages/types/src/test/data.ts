import at from 'lodash/at'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { resolve } from 'path'
import { suite, Test, test } from 'uvu'
import { equal, is } from 'uvu/assert'
import { SafeParseReturnType, ZodTypeAny } from 'zod'
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
  function green(test: Test) {
    test('', () => {
      is(true, true)
    })
  }

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
        const testName = `Path "${issue.path.join('.')}" - ${issue.message} - Expected type '${issue.expected}'`

        test(testName, () => {
          const actual = at(json, [issue.path[0]!])[0]

          const expected = cloneDeep(actual)

          set(
            expected,
            issue.path.slice(1),

            // @ts-expect-error
            `ERROR ${issue.message} - Expected type '${issue.expected}'`
          )

          equal(actual, expected)
        })
      })
    }

    test.run()
  }

  test('catalogs.json', rawDataCatalogs_schema)
  test('countries.json', rawDataCountries_schema)
  test('languages.json', rawDataLanguages_schema)
  test('organization.json', rawDataOrganization_schema)
  test('pages.json', rawDataPages_schema)
  test('products.json', rawDataProducts_schema)
  test('taxonomies.json', rawDataTaxonomies_schema)
  test('taxons.json', rawDataTaxons_schema)
}

export function testJsonData2(path: string) {
  test(`'catalogs.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'catalogs.json')
    const result = rawDataCatalogs_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'countries.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'countries.json')
    const result = rawDataCountries_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'languages.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'languages.json')
    const result = rawDataLanguages_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'organization.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'organization.json')
    const result = rawDataOrganization_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'pages.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'pages.json')
    const result = rawDataPages_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'products.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'products.json')
    const result = rawDataProducts_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'taxonomies.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'taxonomies.json')
    const result = rawDataTaxonomies_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test(`'taxons.json' should be properly defined.`, async () => {
    const json = await importJson(path, 'taxons.json')
    const result = rawDataTaxons_schema.safeParse(json)

    await expectSafeParseResult(json, result)
  })

  test.run()
}

async function expectSafeParseResult<Input, Output>(json: any, result: SafeParseReturnType<Input, Output>) {
  if (result.success === false) {

    result.error.issues.forEach(issue => {
      const actual = at(json, [issue.path[0]!])[0]

      const expected = cloneDeep(actual)

      set(
        expected,
        issue.path.slice(1),

        // @ts-expect-error
        `ERROR ${issue.message} - Expected type '${issue.expected}'`
      )

      // @ts-expect-error
      equal(actual, expected, `Path "${issue.path.join('.')}" - ${issue.message} - Expected type '${issue.expected}'`)
    })
  }
}
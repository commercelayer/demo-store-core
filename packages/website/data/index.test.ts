export {}

describe('JSON Data', () => {
  it('"catalog.json" should be properly defined.', async () => {
    const { getRawDataCatalogs } = await import('./catalogs')
    expect(await getRawDataCatalogs()).toBeDefined()
  })

  it('"taxonomies.json" should be properly defined.', async () => {
    const { getRawDataTaxonomies } = await import('./catalogs')
    expect(await getRawDataTaxonomies()).toBeDefined()
  })

  it('"taxons.json" should be properly defined.', async () => {
    const { getRawDataTaxons } = await import('./catalogs')
    expect(await getRawDataTaxons()).toBeDefined()
  })

  it('"countries.json" should be properly defined.', async () => {
    const { getRawDataCountries } = await import('./countries')
    expect(await getRawDataCountries()).toBeDefined()
  })

  it('"languages.json" should be properly defined.', async () => {
    const { getRawDataLanguages } = await import('./languages')
    expect(await getRawDataLanguages()).toBeDefined()
  })

  it('"organization.json" should be properly defined. Did you run "npm run prebuild"?', async () => {
    const { getRawDataOrganization } = await import('./organization')
    expect(await getRawDataOrganization()).toBeDefined()
  })

  it('"pages.json" should be properly defined.', async () => {
    const { getRawDataPages } = await import('./pages')
    expect(await getRawDataPages()).toBeDefined()
  })

  it('"products.json" should be properly defined.', async () => {
    const { getRawDataProducts } = await import('./products')
    expect(await getRawDataProducts()).toBeDefined()
  })
})

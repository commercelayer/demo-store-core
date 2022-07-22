export {}

describe('JSON Data', () => {
  it('"catalog.json" should be properly defined.', async () => {
    const { rawDataCatalogs } = await import('./catalogs')
    expect(rawDataCatalogs).toBeDefined()
  })

  it('"countries.json" should be properly defined.', async () => {
    const { getRawDataCountries } = await import('./countries')
    const rawDataCountries = await getRawDataCountries()
    expect(rawDataCountries).toBeDefined()
  })

  it('"languages.json" should be properly defined.', async () => {
    const { getRawDataLanguages } = await import('./languages')
    const rawDataLanguages = await getRawDataLanguages()
    expect(rawDataLanguages).toBeDefined()
  })

  it('"organization.json" should be properly defined. Did you run "npm run prebuild"?', async () => {
    const { getRawDataOrganization } = await import('./organization')
    const rawDataOrganization = await getRawDataOrganization()
    expect(rawDataOrganization).toBeDefined()
  })

  it('"pages.json" should be properly defined.', async () => {
    const { getRawDataPages } = await import('./pages')
    const rawDataPages = await getRawDataPages()
    expect(rawDataPages).toBeDefined()
  })

  it('"products.json" should be properly defined.', async () => {
    const { getRawDataProducts } = await import('./products')
    const rawDataProducts = await getRawDataProducts()
    expect(rawDataProducts).toBeDefined()
  })
})

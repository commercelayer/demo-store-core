export {}

describe('JSON Data', () => {
  it('"catalog.json" should be properly defined.', async () => {
    const { rawDataCatalogs } = await import('./catalogs')
    expect(rawDataCatalogs).toBeDefined()
  })

  it('"countries.json" should be properly defined.', async () => {
    const { rawDataCountries } = await import('./countries')
    expect(rawDataCountries).toBeDefined()
  })

  it('"homepage.json" should be properly defined.', async () => {
    const { rawDataHomepage } = await import('./homepage')
    expect(rawDataHomepage).toBeDefined()
  })

  it('"languages.json" should be properly defined.', async () => {
    const { rawDataLanguages } = await import('./languages')
    expect(rawDataLanguages).toBeDefined()
  })

  it('"products.json" should be properly defined.', async () => {
    const { rawDataProducts } = await import('./products')
    expect(rawDataProducts).toBeDefined()
  })
})

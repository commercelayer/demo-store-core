import { z } from 'zod'

const country_schema = z.object({
  /**
   * Country name
   * 
   * This is be shown on the country selector page.
   * @example "United States"
   */
  name: z.string(),

  /**
   * Country code or region code
   * 
   * It follows the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.
   * @example "US"
   */
  code: z.string(),

  /**
   * Market number from your organization
   * 
   * When you select the country from the country selector page, this will be the market in scope when connecting to Commerce Layer.
   * 
   * Market is an **optional** attribute. If you don't specify any market, then the country will be presented with a non-shoppable experience (no price, no availability, no cart).
   * @see https://github.com/commercelayer/demo-store#4-choose-the-countries-where-youre-going-to-sell
   * @example 11279
   */
  market: z.number().optional(),

  /**
   * Reference to the `catalog` id
   * 
   * When you select the country from the country selector page, this information is used to choose the catalog to browse.
   */
  catalog: z.string(),

  /**
   * Default language
   * 
   * This information is used on the country selector page to define a default language when you select a country.
   * @example "en"
   */
  default_language: z.string(),

  /**
   * Region
   * 
   * This information is used on the country selector page to visually defines a group of country.
   * @example "AMERICAS"
   */
  region: z.string()
})

export const rawDataCountries_schema = country_schema.array()

export type RawDataCountry = z.infer<typeof country_schema>

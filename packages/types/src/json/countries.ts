import { z } from 'zod'

type RawDataCountrySchema = z.ZodObject<{
  /**
   * Country name
   * 
   * This is shown on the country selector page.
   * @example "United States"
   */
  name: z.ZodString

  /**
   * Country code or region code
   * 
   * It follows the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard.
   * @example "US"
   */
  code: z.ZodString

  /**
   * Market number from your organization
   * 
   * When you select the country from the country selector page, this will be the market in scope when connecting to Commerce Layer.
   * 
   * Market is an **optional** attribute. If you don't specify any market, then the country will be presented with a non-shoppable experience (no price, no availability, no cart).
   * @see https://github.com/commercelayer/demo-store#4-choose-the-countries-where-youre-going-to-sell
   * @example 11279
   */
  market: z.ZodOptional<z.ZodNumber>

  /**
   * Reference to the `catalogs` id
   * 
   * When you select the country from the country selector page, this information is used to choose the catalog to browse.
   */
  catalog: z.ZodString

  /**
   * Default language
   * 
   * This attribute is used on the country selector page to define a default language when you select a country.
   * @example "en"
   */
  default_language: z.ZodString

  /**
   * Region
   * 
   * This attribute is used on the country selector page to visually defines a group of countries.
   * @example "AMERICAS"
   */
  region: z.ZodString
}>

const rawDataCountry_schema: RawDataCountrySchema = z.object({
  name: z.string(),
  code: z.string(),
  market: z.number().optional(),
  catalog: z.string(),
  default_language: z.string(),
  region: z.string()
})

export const rawDataCountries_schema = rawDataCountry_schema.array()

/**
 * Country
 */
export type RawDataCountry = z.infer<RawDataCountrySchema>

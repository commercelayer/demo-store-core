import { z } from 'zod'

type RawDataLanguageSchema = z.ZodObject<{
  /**
   * Language name
   * 
   * This is shown on the country selector page and in the language selector component.
   * @example "English"
   */
  name: z.ZodString;

  /**
   * Language code
   * 
   * It follows the [ISO 639](https://iso639-3.sil.org/code_tables/639/data) standard.
   * @example "en"
   */
  code: z.ZodString;

  /**
   * Reference to the `catalogs` id
   * 
   * When you select a language without choosing a country (international website), this information is used to choose the catalog to browse.
   */
  catalog: z.ZodString;
}>

const rawDataLanguage_schema: RawDataLanguageSchema = z.object({
  name: z.string(),
  code: z.string(),
  catalog: z.string()
})

export const rawDataLanguages_schema = rawDataLanguage_schema.array()

/**
 * Language
 */
export type RawDataLanguage = z.infer<RawDataLanguageSchema>

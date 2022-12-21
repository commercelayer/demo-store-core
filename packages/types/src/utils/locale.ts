import { z } from 'zod'

export type LocalizedFieldSchema<T extends z.ZodTypeAny> = z.ZodObject<
  {},
  "strip",
  T,
  { [localeCode: string]: z.infer<T> },
  { [localeCode: string]: z.infer<T> }
>

export type LocalizedField<T> = { [localeCode: string]: T }

/**
 * Create a localized field schema
 * @param type Type of the field value (any [zod](https://zod.dev/) type)
 * @returns
 */
export const localizedFieldSchema = <T extends z.ZodTypeAny>(type: T): LocalizedFieldSchema<T> => z
  .object({})
  .catchall(type)

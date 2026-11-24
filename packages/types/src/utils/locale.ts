import { z } from 'zod'

export type LocalizedFieldSchema<T extends z.ZodType> = z.ZodObject<{}, z.core.$catchall<T>>

export type LocalizedField<T> = { [localeCode: string]: T }

/**
 * Create a localized field schema
 * @param type Type of the field value (any [zod](https://zod.dev/) type)
 * @returns
 */
export const localizedFieldSchema = <T extends z.ZodType>(type: T): LocalizedFieldSchema<T> => z
  .object({})
  .catchall(type)

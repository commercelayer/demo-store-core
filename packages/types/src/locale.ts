import { z } from 'zod'

export const localizedFieldSchema = <T extends z.ZodTypeAny>(type: T) => z
  .object({})
  .catchall(type.optional())

export type LocalizedField<T> = {
  [localeCode: string]: T | undefined
}

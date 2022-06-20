import { z } from 'zod'

export type Unserializable<T> = {
  _unserializable: Symbol
  data: T
}

export function makeUnserializable<T>(data: T): Unserializable<T> {
  return {
    _unserializable: Symbol.for('unserializable'),
    data
  }
}

export const unserializableSchema = <T extends z.ZodTypeAny>(data: T) => z.object({
  _unserializable: z.unknown().default(Symbol.for('unserializable')),
  data
})
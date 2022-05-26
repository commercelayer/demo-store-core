export type Unserializable<T> = T & {
  _unserializable: Symbol
}

export function makeUnserializable<T>(item: T): Unserializable<T> {
  return {
    _unserializable: Symbol.for('unserializable'),
    ...item
  }
}

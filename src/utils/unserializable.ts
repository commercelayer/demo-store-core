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

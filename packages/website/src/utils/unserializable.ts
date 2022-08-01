export type Unserializable<T> = {
  /**
   * This is the Symbol that makes the object unserializable.
   */
  _unserializable: Symbol

  /**
   * Original value.
   */
  value: T
}

/**
 * Make the received value unserializable.
 * This is useful to avoid passing whole object as props to components and should help you to reduce the size of the serialized data.
 * @url [Large page data](https://nextjs.org/docs/messages/large-page-data)
 */
export function makeUnserializable<T>(value: T): Unserializable<T> {
  return {
    _unserializable: Symbol.for('unserializable'),
    value
  }
}

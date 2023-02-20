/**
 * Check if the value is different from `null` and `undefined`.
 * @returns `true` when `value` is different from `null` and `undefined`.
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Pick by values
 * @see https://javascript.plainenglish.io/pick-by-values-in-typescript-a-widely-used-trick-in-many-famous-projects-that-you-should-know-38801eaac1aa
 * @see https://github.com/piotrwitek/utility-types#pickbyvalueexactt-valuetype
 */
export type PickByValueExact<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: [ValueType] extends [T[Key]]
    ? [T[Key]] extends [ValueType]
    ? Key
    : never
    : never
  }[keyof T]
>
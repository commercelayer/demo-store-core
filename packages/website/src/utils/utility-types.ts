/**
 * Check if the value is different from `null` and `undefined`.
 * @returns `true` when `value` is different from `null` and `undefined`.
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

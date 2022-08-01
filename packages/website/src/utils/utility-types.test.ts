import { isNotNullish } from './utility-types'

test('isNotNullish should return true when the value is not nullish', () => {
  expect(isNotNullish(1)).toBe(true)
  expect(isNotNullish('a')).toBe(true)
  expect(isNotNullish(true)).toBe(true)
  expect(isNotNullish(false)).toBe(true)
  expect(isNotNullish(null)).toBe(false)
  expect(isNotNullish(undefined)).toBe(false)
})

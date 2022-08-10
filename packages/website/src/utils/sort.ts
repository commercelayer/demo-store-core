import type { SortingRule, SortValue } from '@commercelayer/demo-store-types'

type PatternMapValue<T extends SortValue> = {
  sort: SortingRule['sort']
  values: T[]
}

/**
 * Sort a list of values given a set of rules.
 * @param values List of values to sort
 * @param sortingRules Sorting rules
 * @returns Sorted values
 */
export function sort<T extends SortValue = SortValue>(values: T[], sortingRules: SortingRule[]): T[] {

  const patternMap = new Map<SortingRule['pattern'], PatternMapValue<T>>(
    sortingRules.map(({ pattern, sort }) => (
      [
        pattern,
        {
          values: [],
          sort
        }
      ]
    ))
  )

  values.forEach((value) => {
    const match = sortingRules.find(({ pattern }) => pattern.test(value.toString()))

    if (match) {
      const patternMatched = patternMap.get(match.pattern)
  
      if (patternMatched) {
        patternMatched.values.push(value)
      }
    } else {
      console.error(`No matching pattern for "${value}"`)
    }

  })

  const result = Array.from(patternMap.values())
    .map(({ sort, values }) => {
      return sort ? sort(values) : values.sort()
    })
    .flat()

  return result
}

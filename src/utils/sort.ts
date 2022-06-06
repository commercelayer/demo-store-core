type Value = string | boolean | number

export type SortOrder = {
  pattern: RegExp
  sort?: (values: Value[]) => Value[]
}

type PatternMapValue = {
  sort: SortOrder['sort']
  values: Value[]
}

export function sort(values: Value[], sortOrder: SortOrder[]): Value[] {

  const patternMap = new Map<SortOrder['pattern'], PatternMapValue>(
    sortOrder.map(({ pattern, sort }) => (
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
    const match = sortOrder.find(({ pattern }) => pattern.test(value.toString()))

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

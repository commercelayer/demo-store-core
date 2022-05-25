
export function combine<A, B, C>(a: A[], b: B[], callback: (a: A, b: B) => C) {
  if (!a || a.length <= 0) {
    throw new Error('"a" cannot be an empty array!')
  }

  if (!b || b.length <= 0) {
    throw new Error('"b" cannot be an empty array!')
  }

  return a.map(av => b.map(bv => callback(av, bv))).flat()
}


/**
 * Find a key-pair-value deeply.
 * 
 * @example
 * deepFind(
 *   [
 *     {
 *       slug: '/level-1',
 *       children: [{
 *         children: [],
 *         slug: '/level-1/level-2',
 *       }]
 *     }
 *   ],
 *   'children',
 *   'slug',
 *   '/level-1/level-2'
 * )
 * 
 */
export function deepFind<T extends DeepFindable<IteratorKey, SearchKey>, IteratorKey extends string, SearchKey extends string>(items: T[], iteratorKey: IteratorKey, searchKey: SearchKey, searchValue: string): DeepFindResult<T> | undefined {
  for (const item of items) {
    if (item[searchKey] === searchValue) {
      return {
        result: item,
        memo: [item]
      }
    }

    const children = item[iteratorKey]

    if (Array.isArray(children)) {
      const child = deepFind(children, iteratorKey, searchKey, searchValue)

      if (child) {
        return {
          result: child.result,
          memo: [item].concat(child.memo)
        }
      }
    }
  }
}

type DeepFindable<IteratorKey extends string, SearchKey extends string> = {
  [iteratorKey in IteratorKey | SearchKey]: iteratorKey extends SearchKey ? string : DeepFindable<IteratorKey, SearchKey>[]
}

export type DeepFindResult<T> = {
  result: T
  memo: T[]
}
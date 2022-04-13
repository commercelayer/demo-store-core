export function combine<A, B, C>(a: A[], b: B[], callback: (a: A, b: B) => C) {
  if (!a || a.length <= 0) {
    throw new Error('"a" cannot be an empty array!')
  }

  if (!b || b.length <= 0) {
    throw new Error('"b" cannot be an empty array!')
  }

  return a.map(av => b.map(bv => callback(av, bv))).flat()
}

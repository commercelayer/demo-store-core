function createMemo() {
  const memo: { [key: string]: any } = {}
  return function (fn: Function) {
    const key = fn.toString()
    if (!memo[key]) {
      memo[key] = fn()
    }
    return memo[key]
  }
}

export const memo = createMemo()

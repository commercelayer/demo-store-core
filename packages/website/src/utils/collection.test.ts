import { combine, deepFind } from './collection'

describe('combine', () => {
  it('should not accept empty array as input', () => {
    expect(() => combine([], [], (a, b) => `${a}-${b}`)).toThrow()
    expect(() => combine([], ['1', '2'], (a, b) => `${a}-${b}`)).toThrow()
    expect(() => combine(['it', 'en'], [], (a, b) => `${a}-${b}`)).toThrow()

    // @ts-expect-error
    expect(() => combine(undefined, undefined, (a, b) => `${a}-${b}`)).toThrow()
  })

  it('should combines two arrays into one, using a callback method', () => {
    const result1 = combine(['it', 'en'], ['1', '2'], (a, b) => `${a}-${b}`)
    expect(result1).toStrictEqual(['it-1', 'it-2', 'en-1', 'en-2'])

    const result2 = combine([10, 9], [1, 2], (a, b) => a - b)
    expect(result2).toStrictEqual([9, 8, 8, 7])
  })
})

describe('deepFind', () => {
  it('should be able to find deep elements', () => {
    const obj0 = { slug: 'cat-2/sub-1/sub-2', children: [] }
    const obj1 = { slug: 'cat-2/sub-1', children: [obj0] }
    const obj2 = { slug: 'cat-1', children: [] }
    const obj3 = { slug: 'cat-2', children: [obj1] }
    const obj4 = { slug: 'cat-3', children: [] }

    expect(
      deepFind([obj2, obj3, obj4], 'children', 'slug', 'cat-2/sub-1/sub-2')
    ).toStrictEqual({
      result: obj0,
      memo: [obj3, obj1, obj0]
    })

    expect(
      deepFind([obj2, obj3, obj4], 'children', 'slug', 'cat-3')
    ).toStrictEqual({
      result: obj4,
      memo: [obj4]
    })
  })

  it('should be able to manage correctly the memo at 1st level', () => {
    const obj1 = { slug: 'something', children: [] }
    const obj2 = { slug: 'another', children: [] }

    const result = deepFind([obj1, obj2], 'children', 'slug', 'another')

    expect(result).toStrictEqual({
      result: obj2,
      memo: [obj2]
    })
  })

})
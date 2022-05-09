import { deepFind } from '#data/catalogs'

it('should be able to find deep elements', () => {
  const obj0 = { slug: 'cat-2/sub-1/sub-2', taxons: [] }
  const obj1 = { slug: 'cat-2/sub-1', taxons: [obj0] }
  const obj2 = { slug: 'cat-1', taxons: [] }
  const obj3 = { slug: 'cat-2', taxons: [obj1] }
  const obj4 = { slug: 'cat-3', taxons: [] }

  expect(
    deepFind([obj2, obj3, obj4], 'taxons', 'slug', 'cat-2/sub-1/sub-2')
  ).toStrictEqual({
    result: obj0,
    memo: [obj3, obj1, obj0]
  })

  expect(
    deepFind([obj2, obj3, obj4], 'taxons', 'slug', 'cat-3')
  ).toStrictEqual({
    result: obj4,
    memo: [obj4]
  })
})

it('should be able to manage correctly the memo at 1st level', () => {
  const obj1 = { slug: 'something', taxons: [] }
  const obj2 = { slug: 'another', taxons: [] }

  const result = deepFind([obj1, obj2], 'taxons', 'slug', 'another')

  expect(result).toStrictEqual({
    result: obj2,
    memo: [obj2]
  })
})

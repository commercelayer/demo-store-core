import { deepFind } from '#data/catalogs'

it('should be able to find deep elements', () => {
  const obj1 = { slug: 'another/one', taxons: [] }
  const obj2 = { slug: 'something', taxons: [] }
  const obj3 = { slug: 'another', taxons: [obj1] }

  const result = deepFind([obj2, obj3], 'taxons', 'slug', 'another/one')

  expect(result).toStrictEqual({
    result: obj1,
    memo: [obj3, obj1]
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

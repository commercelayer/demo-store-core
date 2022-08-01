import { makeUnserializable } from './unserializable'
import { isSerializableProps } from 'next/dist/lib/is-serializable-props'

test('"makeUnserializable" should make an object unserializable', () => {
  const obj = {
    firstname: 'John',
    lastname: 'Doe'
  }

  const unserializableObj = makeUnserializable(obj)

  expect(unserializableObj).toMatchObject({
    _unserializable: Symbol.for('unserializable'),
    value: {
      firstname: 'John',
      lastname: 'Doe'
    }
  })

  expect(isSerializableProps('page', 'method', obj)).toBe(true)

  expect(() => isSerializableProps('page', 'method', unserializableObj)).toThrow()

  expect(JSON.stringify(unserializableObj)).toEqual('{"value":{"firstname":"John","lastname":"Doe"}}')
})

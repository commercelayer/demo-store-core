import type { SortingRule } from '@commercelayer/demo-store-types'
import { sort } from './sort'

const sortingRules: SortingRule[] = [
  { pattern: /^(One Size|U)$/ },
  {
    pattern: /^[0-9]+ months$/,
    sort: values => values.sort((a, b) => parseInt(a.toString()) - parseInt(b.toString()))
  },
  { pattern: /^[X/S]+S$/i, sort: values => values.sort((a, b) => b.toString().localeCompare(a.toString())) },
  { pattern: /^S$/i },
  { pattern: /^M$/i },
  { pattern: /^L$/i },
  { pattern: /^[X]+L$/i },
  { pattern: /^[4-9]XL$/i },
  {
    pattern: /^[0-9\.\,]+?$/,
    sort: values => values.sort((a, b) => {
      return parseFloat(a.toString().replace(',', '.')) - parseFloat(b.toString().replace(',', '.'))
    })
  }
]

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { })
})

afterAll(() => {
  // @ts-expect-error
  console.error.mockRestore()
})

afterEach(() => {
  // @ts-expect-error
  console.error.mockClear()
})

test('"sort" should show a console.error when there are no matching patterns', () => {

  const sorted = sort([
    '7.5',
    '7',
    '8.5',
    'NO PATTERN FOR THIS!',
    'L',
    '8,4',
  ], sortingRules)

  expect(sorted).toMatchObject([
    'L',
    '7',
    '7.5',
    '8,4',
    '8.5',
  ])

  expect(console.error).toBeCalledWith('No matching pattern for "NO PATTERN FOR THIS!"')
})

test('"sort" should sort an array of strings given a complex SortOrder object', () => {
  const sorted = sort([
    '7.5',
    '7',
    '8.5',
    '8',
    '9',
    'L',
    '8,4',
    'M',
    'U',
    'S',
    '12 months',
    '6 months',
    'One Size',
    'XS',
    'XL',
    'XXXL',
    'XXS',
  ], sortingRules)

  expect(console.error).not.toBeCalled()

  expect(sorted).toMatchObject([
    'One Size',
    'U',
    '6 months',
    '12 months',
    'XXS',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXXL',
    '7',
    '7.5',
    '8',
    '8,4',
    '8.5',
    '9',
  ])
})

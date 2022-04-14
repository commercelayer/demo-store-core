import { render } from '@testing-library/react'
import { Link } from './Link'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('should be able to switch "locale" from root', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/'
  }))

  const { container } = render(<Link locale="en-us">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-us">Path 1</a></div>')
})

test('should be able to switch "locale" from a locale path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]',
    pathname: '/[locale]',
    query: { locale: 'en-br' },
    asPath: '/en-br',
  }))

  const { container } = render(<Link locale="en-us">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-us">Path 1</a></div>')
})

test('should be able to switch "locale" from any path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-be' },
    asPath: '/en-be/another'
  }))

  const { container } = render(<Link locale="en-us">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-us/another">Path 1</a></div>')
})

test('should be able to switch "href" from root', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/'
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/path-1">Path 1</a></div>')
})

test('should be able to switch "href" from a locale path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]',
    pathname: '/[locale]',
    query: { locale: 'en-br' },
    asPath: '/en-br',
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-br/path-1">Path 1</a></div>')
})

test('should be able to switch "href" from any path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-be' },
    asPath: '/en-be/another'
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-be/path-1">Path 1</a></div>')
})

test('should be able to switch "href" with a path that contains a valid locale', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-be' },
    asPath: '/en-be/another'
  }))

  const { container } = render(<Link href="/en-us/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-be/en-us/path-1">Path 1</a></div>')
})

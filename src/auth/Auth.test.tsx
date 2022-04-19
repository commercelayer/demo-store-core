import { render } from '@testing-library/react'
import { Auth } from './Auth'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('should match the snapshot', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/'
  }))

  const { container } = render(<Auth>Children</Auth>)
  expect(container).toMatchSnapshot()
})

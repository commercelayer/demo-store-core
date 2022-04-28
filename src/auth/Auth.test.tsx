import { AuthReturnType as OriginalAuthReturnType } from '@commercelayer/js-auth'
import { render, act, screen } from '@testing-library/react'
import { Auth } from './Auth'
import CommerceLayerContext from '@commercelayer/react-components/lib/context/CommerceLayerContext'
import { useContext } from 'react'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const getSalesChannelToken = jest.spyOn(require('@commercelayer/js-auth'), 'getSalesChannelToken')

type AuthReturnType = Pick<NonNullable<Awaited<OriginalAuthReturnType>>, 'tokenType' | 'accessToken' | 'expires' | 'refreshToken'>

beforeEach(() => {
  useRouter.mockReset()
})

const ContextTester = () => {
  const { accessToken, endpoint } = useContext(CommerceLayerContext)

  return (
    <>
      <div data-testid="accessToken">accessToken: {accessToken}</div>
      <div data-testid="endpoint">endpoint: {endpoint}</div>
    </>
  )
}

test('should match the snapshot', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/'
  }))

  const { container } = render(<Auth><ContextTester /></Auth>)
  expect(container).toMatchSnapshot()
})

test('should fetch accessToken and set it properly when "locale" is set', async () => {
  process.env.NEXT_PUBLIC_CL_CLIENT_ID = 'client-1234'
  process.env.NEXT_PUBLIC_CL_ENDPOINT = 'https://example.com'

  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {
      locale: 'en-US'
    },
    asPath: '/'
  }))

  const authReturn: AuthReturnType = {
    tokenType: 'bearer',
    accessToken: 'accessToken-1234',
    expires: new Date(0),
    refreshToken: 'refreshToken-1234'
  }

  getSalesChannelToken.mockResolvedValue(authReturn)

  await act(async () => {
    render(<Auth><ContextTester /></Auth>)
  })

  expect(getSalesChannelToken).toBeCalledWith({
    clientId: 'client-1234',
    endpoint: 'https://example.com',
    scope: 'market:400'
  })

  expect(localStorage.getItem('clayer_token-market:400')).toEqual(JSON.stringify({
    tokenType: 'bearer',
    accessToken: 'accessToken-1234',
    expires: 0,
    refreshToken: 'refreshToken-1234'
  }))

  expect(screen.getByTestId('accessToken')).toHaveTextContent('accessToken-1234')
  expect(screen.getByTestId('endpoint')).toHaveTextContent('https://example.com')
})

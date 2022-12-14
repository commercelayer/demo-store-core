import { useAuthContext } from '#contexts/AuthContext'
import { SettingsProvider } from '#contexts/SettingsContext'
import type { AuthReturnType as OriginalAuthReturnType } from '@commercelayer/js-auth'
import CommerceLayerContext from '../../../../node_modules/@commercelayer/react-components/lib/cjs/context/CommerceLayerContext'
import { act, render, screen } from '@testing-library/react'
import { createLocale, createOrganization, createRouter } from 'jest.helpers'
import { useContext } from 'react'
import { Auth } from './Auth'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const getSalesChannelToken = jest.spyOn(require('@commercelayer/js-auth'), 'getSalesChannelToken')

type AuthReturnType = Pick<NonNullable<Awaited<OriginalAuthReturnType>>, 'tokenType' | 'accessToken' | 'expires' | 'refreshToken'>

beforeEach(() => {
  useRouter.mockReset()
})

const ContextTester = () => {
  const { accessToken: clAccessToken, endpoint: clEndpoint } = useContext(CommerceLayerContext)
  const { accessToken, endpoint, organization, domain } = useAuthContext()

  return (
    <>
      <div data-testid="clAccessToken">clAccessToken: {clAccessToken}</div>
      <div data-testid="clEndpoint">clEndpoint: {clEndpoint}</div>
      <div data-testid="accessToken">accessToken: {accessToken}</div>
      <div data-testid="endpoint">endpoint: {endpoint}</div>
      <div data-testid="organization">organization: {organization}</div>
      <div data-testid="domain">domain: {domain}</div>
    </>
  )
}

test('should match the snapshot', async () => {
  process.env.NEXT_PUBLIC_CL_CLIENT_ID = 'client-1234'
  process.env.NEXT_PUBLIC_CL_ENDPOINT = 'https://demo-store.commercelayer.co'

  useRouter.mockImplementation(() => createRouter('/'))

  const authReturn: AuthReturnType = {
    tokenType: 'bearer',
    accessToken: 'accessToken-1234',
    expires: new Date(0),
    refreshToken: 'refreshToken-1234'
  }

  getSalesChannelToken.mockResolvedValue(authReturn)

  let container
  await act(async () => {
    ({ container } = render(<Auth locale={createLocale()}><ContextTester /></Auth>))
  })

  expect(container).toMatchSnapshot()
})

test('should fetch accessToken and set it properly when "locale" is set', async () => {
  process.env.NEXT_PUBLIC_CL_CLIENT_ID = 'client-1234'
  process.env.NEXT_PUBLIC_CL_ENDPOINT = 'https://demo-store.commercelayer.co'

  useRouter.mockImplementation(() => createRouter('/'))

  const authReturn: AuthReturnType = {
    tokenType: 'bearer',
    accessToken: 'accessToken-1234',
    expires: new Date(0),
    refreshToken: 'refreshToken-1234'
  }

  getSalesChannelToken.mockResolvedValue(authReturn)

  await act(async () => {
    render(
      <SettingsProvider locale={createLocale()} organization={{ ...createOrganization(), slug: 'commerce-layer' }}>
        <Auth locale={createLocale()}><ContextTester /></Auth>
      </SettingsProvider>
    )
  })

  expect(getSalesChannelToken).toBeCalledWith({
    clientId: 'client-1234',
    endpoint: 'https://demo-store.commercelayer.co',
    scope: 'market:123456789'
  })

  expect(localStorage.getItem('clayer_token-market:123456789')).toEqual(JSON.stringify({
    tokenType: 'bearer',
    accessToken: 'accessToken-1234',
    expires: 0,
    refreshToken: 'refreshToken-1234'
  }))

  expect(screen.getByTestId('clAccessToken')).toHaveTextContent('accessToken-1234')
  expect(screen.getByTestId('clEndpoint')).toHaveTextContent('https://demo-store.commercelayer.co')

  expect(screen.getByTestId('accessToken')).toHaveTextContent('accessToken-1234')
  expect(screen.getByTestId('endpoint')).toHaveTextContent('https://demo-store.commercelayer.co')
  expect(screen.getByTestId('organization')).toHaveTextContent('demo-store')
  expect(screen.getByTestId('domain')).toHaveTextContent('commercelayer.co')

})

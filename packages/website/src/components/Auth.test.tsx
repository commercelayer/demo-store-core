import { useAuthContext } from '#contexts/AuthContext'
import { SettingsProvider } from '#contexts/SettingsContext'
import CommerceLayerContext from '../../../../node_modules/@commercelayer/react-components/lib/cjs/context/CommerceLayerContext'
import { act, render, screen } from '@testing-library/react'
import { createLocale, createOrganization, createRouter } from 'jest.helpers'
import { useContext } from 'react'
import { Auth } from './Auth'

import * as JsAuth from '@commercelayer/js-auth'

jest.mock('@commercelayer/js-auth', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@commercelayer/js-auth')
  };
});

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const authentication = jest.spyOn(JsAuth, 'authenticate')

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

  useRouter.mockImplementation(() => createRouter('/'))

  authentication.mockResolvedValue({
    tokenType: 'bearer',
    accessToken: accessToken,
    expires: new Date(0),
    refreshToken: 'refreshToken-1234',
    createdAt: 0,
    expiresIn: 0,
    ownerId: '',
    ownerType: 'customer',
    scope: '',
  })

  let container

  await act(async () => {
    ({ container } = render(
      <SettingsProvider locale={createLocale()} organization={{ ...createOrganization() }}>
        <Auth locale={createLocale()}><ContextTester /></Auth>
      </SettingsProvider>
    ))
  })

  expect(container).toMatchSnapshot()
})

test('should fetch accessToken and set it properly when "locale" is set', async () => {
  process.env.NEXT_PUBLIC_CL_CLIENT_ID = 'client-1234'

  useRouter.mockImplementation(() => createRouter('/'))

  authentication.mockResolvedValue({
    tokenType: 'bearer',
    accessToken: accessToken,
    expires: new Date(0),
    refreshToken: 'refreshToken-1234',
    createdAt: 0,
    expiresIn: 0,
    ownerId: '',
    ownerType: 'customer',
    scope: '',
  })

  await act(async () => {
    render(
      <SettingsProvider locale={createLocale()} organization={{ ...createOrganization() }}>
        <Auth locale={createLocale()}><ContextTester /></Auth>
      </SettingsProvider>
    )
  })

  expect(authentication).toHaveBeenCalledWith('client_credentials', {
    clientId: 'client-1234',
    scope: 'market:code:us'
  })

  expect(localStorage.getItem('clayer_token-market:code:us')).toEqual(JSON.stringify({
    tokenType: 'bearer',
    accessToken: accessToken,
    expires: 0,
    refreshToken: 'refreshToken-1234'
  }))

  expect(screen.getByTestId('clAccessToken')).toHaveTextContent(accessToken)
  expect(screen.getByTestId('clEndpoint')).toHaveTextContent('https://demo-store.commercelayer.io')

  expect(screen.getByTestId('accessToken')).toHaveTextContent(accessToken)
  expect(screen.getByTestId('endpoint')).toHaveTextContent('https://demo-store.commercelayer.io')
  expect(screen.getByTestId('organization')).toHaveTextContent('demo-store')
  expect(screen.getByTestId('domain')).toHaveTextContent('commercelayer.io')

})

const accessToken = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJleW9aT0Z2UHBSIiwic2x1ZyI6ImRlbW8tc3RvcmUiLCJlbnRlcnByaXNlIjp0cnVlLCJyZWdpb24iOiJldS13ZXN0LTEifSwiYXBwbGljYXRpb24iOnsiaWQiOiJwWWRxaVBBUW5NIiwiY2xpZW50X2lkIjoiQklTRzhiYjNHV3BDOF9EN050MVN1V1dkaWVTNWJKcTgzMUE1MExnQl9JZyIsImtpbmQiOiJzYWxlc19jaGFubmVsIiwicHVibGljIjp0cnVlfSwic2NvcGUiOiJzdG9ja19sb2NhdGlvbjppZDpER3pBb3VwcHduIiwiZXhwIjoxNzI3MTY5NTQ5LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjg0MjUwNTQ0NTgzNjAxOTksImlhdCI6MTcyNzE2MjM0OSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmNvbW1lcmNlbGF5ZXIuaW8ifQ.rFYL56S-j60pgJ5QaomqHZF3fk97jRAOpj2kzHMr6TbYdwyJUc1GFxQZuHkN0CLuVh32hQ_nsJ6alw7zJiCcmlkqKhlTHqvyHHcYvmFkGP9ZhiBOvfVMNSjHkxcWT-a58U6ao8UZflqSkYkOAqWTQK3rQuAQTWtSox18UstUnI_G8oxtzRLmKDJhCzC5Bl3ewwNgrEo7soosRq9XTSjOffS57JLCl3-3wy69fhHAmmk_zXaUuV_vgiLREh-WYE4fqBg7dUnarqpE7w_20bHclEQ_Zg9dAaZ093g0IeHOs-GtzZyCDhSbcgJgp62wPQomjiJxKH1yjBJ5EkttqqSzQdUJftL8MgfEUF8tfPBMTs6GQSxIczPNmlk4EMeeIpKA8TMj0pPzwXOtd8Eetqen9DzgKYWoKLUXRSZx41YcAdHOFMSEh4j6lGL3GBVP2KiuyLzwk_sHKQR_4ppGDY5aIQA7pYjSyQVDf2SQa07FhSsZNfWdIkrv-YpjSDeNA0zDuoJkIVG4yUuE8D-LHYM4_P9KJPKo9kmd00zJthkcAZ-_QoBxq5-QPLh4aWiCwhRzfeJVtsIdFfBeMos4ar36g-5XtYjJ1c259TsHPF5iu38n4fbBY1jYFle1eiANAWpmPw_GVi13HutEe7Aoef0zFGzK3mEulls2NcBu0Ybh3as'

import { useAuthContext } from '#contexts/AuthContext'
import { SettingsProvider } from '#contexts/SettingsContext'
import CommerceLayerContext from '../../../../node_modules/@commercelayer/react-components/lib/cjs/context/CommerceLayerContext'
import { act, render } from '@testing-library/react'
import { createLocale, createOrganization, createRouter } from 'jest.helpers'
import { useContext } from 'react'
import { Auth } from './Auth'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 1412,
      scope,
      created_at: Date.now()
    }),
  }),
) as jest.Mock;

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

const ContextTester = () => {
  const { accessToken: clAccessToken, endpoint: clEndpoint } = useContext(CommerceLayerContext)
  const { endpoint, organization, domain } = useAuthContext()

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
  const clientId = 'client-1234'

  process.env.NEXT_PUBLIC_CL_CLIENT_ID = clientId

  useRouter.mockImplementation(() => createRouter('/'))

  let container

  await act(async () => {
    ({ container } = render(
      <SettingsProvider locale={createLocale()} organization={{ ...createOrganization() }}>
        <Auth locale={createLocale()}><ContextTester /></Auth>
      </SettingsProvider>
    ))
  })

  expect(container).toMatchSnapshot()

  expect(localStorage.getItem(`cl_guest-${clientId}-${scope}`)).toEqual(
    JSON.stringify(
      {
        accessToken: accessToken,
        scope
      }
    )
  )
})

const accessToken = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJleW9aT0Z2UHBSIiwic2x1ZyI6ImRlbW8tc3RvcmUiLCJlbnRlcnByaXNlIjp0cnVlLCJyZWdpb24iOiJldS13ZXN0LTEifSwiYXBwbGljYXRpb24iOnsiaWQiOiJwWWRxaVBBUW5NIiwiY2xpZW50X2lkIjoiQklTRzhiYjNHV3BDOF9EN050MVN1V1dkaWVTNWJKcTgzMUE1MExnQl9JZyIsImtpbmQiOiJzYWxlc19jaGFubmVsIiwicHVibGljIjp0cnVlfSwic2NvcGUiOiJzdG9ja19sb2NhdGlvbjppZDpER3pBb3VwcHduIiwiZXhwIjoxNzI3MTY5NTQ5LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjg0MjUwNTQ0NTgzNjAxOTksImlhdCI6MTcyNzE2MjM0OSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmNvbW1lcmNlbGF5ZXIuaW8ifQ.rFYL56S-j60pgJ5QaomqHZF3fk97jRAOpj2kzHMr6TbYdwyJUc1GFxQZuHkN0CLuVh32hQ_nsJ6alw7zJiCcmlkqKhlTHqvyHHcYvmFkGP9ZhiBOvfVMNSjHkxcWT-a58U6ao8UZflqSkYkOAqWTQK3rQuAQTWtSox18UstUnI_G8oxtzRLmKDJhCzC5Bl3ewwNgrEo7soosRq9XTSjOffS57JLCl3-3wy69fhHAmmk_zXaUuV_vgiLREh-WYE4fqBg7dUnarqpE7w_20bHclEQ_Zg9dAaZ093g0IeHOs-GtzZyCDhSbcgJgp62wPQomjiJxKH1yjBJ5EkttqqSzQdUJftL8MgfEUF8tfPBMTs6GQSxIczPNmlk4EMeeIpKA8TMj0pPzwXOtd8Eetqen9DzgKYWoKLUXRSZx41YcAdHOFMSEh4j6lGL3GBVP2KiuyLzwk_sHKQR_4ppGDY5aIQA7pYjSyQVDf2SQa07FhSsZNfWdIkrv-YpjSDeNA0zDuoJkIVG4yUuE8D-LHYM4_P9KJPKo9kmd00zJthkcAZ-_QoBxq5-QPLh4aWiCwhRzfeJVtsIdFfBeMos4ar36g-5XtYjJ1c259TsHPF5iu38n4fbBY1jYFle1eiANAWpmPw_GVi13HutEe7Aoef0zFGzK3mEulls2NcBu0Ybh3as'
const scope = 'market:code:eu'
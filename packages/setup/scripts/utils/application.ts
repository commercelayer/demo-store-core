import { getIntegrationToken } from '@commercelayer/js-auth'
import CommerceLayer from '@commercelayer/sdk'
import { execSync } from 'child_process'

type Application = {
  kind: string;
  name: string;
  clientId: string;
  clientSecret: string;
  endpoint: string;
  organization: string;
  slug: string;
}

export const getCurrentApplicationInfo = (): Application => {

  const applicationInfo = execSync('commercelayer applications:info --json', {
    stdio: 'pipe'
  }).toString()

  return {
    kind: (applicationInfo.match(/"kind": "(.*)"/) || [])[1],
    name: (applicationInfo.match(/"name": "(.*)"/) || [])[1],
    clientId: (applicationInfo.match(/"clientId": "(.*)"/) || [])[1],
    clientSecret: (applicationInfo.match(/"clientSecret": "(.*)"/) || [])[1],
    endpoint: (applicationInfo.match(/"baseUrl": "(.*)"/) || [])[1],
    organization: (applicationInfo.match(/"organization": "(.*)"/) || [])[1],
    slug: (applicationInfo.match(/"slug": "(.*)"/) || [])[1],
  }
}

export const createCommerceLayerClient = async (application: Application) => {
  if (application.kind !== 'integration') {
    throw new Error('You should switch to an Integration type')
  }

  const integrationToken = await getIntegrationToken({
    endpoint: application.endpoint,
    scope: 'market:all',
    clientId: application.clientId,
    clientSecret: application.clientSecret,
  })

  if (!integrationToken) {
    throw new Error('Invalid credential.')
  }

  return CommerceLayer({
    organization: application.slug,
    accessToken: integrationToken.accessToken
  })
}
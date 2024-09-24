// @ts-check

const { authenticate, getCoreApiBaseEndpoint } = require('@commercelayer/js-auth')
const CommerceLayer = require('@commercelayer/sdk').default
const { writeFileSync, existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const { isSupportedUrl } = require('./src/utils/isSupportedUrl')

/** @type { import('./additional-env').DemoStoreEnvs } */
const envs = require('./src/utils/envs')

const { NEXT_PUBLIC_CL_CLIENT_ID } = process.env

if (!isSupportedUrl(envs.NEXT_PUBLIC_JSON_DATA_FOLDER) && NEXT_PUBLIC_CL_CLIENT_ID) {
  const organizationJsonPath = resolve(__dirname, envs.NEXT_PUBLIC_JSON_DATA_FOLDER, 'organization.json')

  /** @type { import('@commercelayer/demo-store-types').RawDataOrganization } */
  const currentOrganization = existsSync(organizationJsonPath) ? JSON.parse(readFileSync(organizationJsonPath, { encoding: 'utf-8' }) || '{}') : {}

  if (!existsSync(organizationJsonPath)) {
    writeFileSync(organizationJsonPath, '{}', { encoding: 'utf-8' })
  }

  authenticate('client_credentials', {
    clientId: NEXT_PUBLIC_CL_CLIENT_ID,
    scope: `market:all`
  })
    .then(auth => {
      const endpoint = getCoreApiBaseEndpoint(auth.accessToken)
      const [, organization, domain] = endpoint.match(/^https?:\/\/(.*).(commercelayer.(co|io))$/) || []

      if (!auth) {
        return
      }

      const client = CommerceLayer({
        accessToken: auth.accessToken,
        organization,
        domain
      })

      client.organization.retrieve()
        .then(organization => {

          /** @type { import('@commercelayer/demo-store-types').RawDataOrganization } */
          const organizationSettings = {
            ...currentOrganization,
            name: organization.name || undefined,
            favicon_url: organization.favicon_url || undefined,
            logo_url: organization.logo_url || undefined,
            primary_color: organization.primary_color || undefined
          }

          writeFileSync(
            organizationJsonPath,
            JSON.stringify(organizationSettings, undefined, 2),
            { encoding: 'utf-8' }
          )
        })

    })
}

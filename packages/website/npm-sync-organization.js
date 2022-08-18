// @ts-check

const { getSalesChannelToken } = require('@commercelayer/js-auth')
const CommerceLayer = require('@commercelayer/sdk').default
const { writeFileSync, existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const { isSupportedUrl } = require('./src/utils/isSupportedUrl')

/** @type { import('./additional-env').DemoStoreEnvs } */
const envs = require('./src/utils/envs')

const { NEXT_PUBLIC_CL_ENDPOINT, NEXT_PUBLIC_CL_CLIENT_ID } = process.env

if (!isSupportedUrl(envs.NEXT_PUBLIC_JSON_DATA_FOLDER) && NEXT_PUBLIC_CL_CLIENT_ID && NEXT_PUBLIC_CL_ENDPOINT) {
  const organizationJsonPath = resolve(__dirname, envs.NEXT_PUBLIC_JSON_DATA_FOLDER, 'organization.json')

  /** @type { import('@commercelayer/demo-store-types').RawDataOrganization } */
  const currentOrganization = existsSync(organizationJsonPath) ? JSON.parse(readFileSync(organizationJsonPath, { encoding: 'utf-8' }) || '{}') : {}

  if (!existsSync(organizationJsonPath)) {
    writeFileSync(organizationJsonPath, '{}', { encoding: 'utf-8' })
  }

  const [, organization, domain] = NEXT_PUBLIC_CL_ENDPOINT.match(/^https?:\/\/(.*).(commercelayer.(co|io))$/) || []

  getSalesChannelToken({
    clientId: NEXT_PUBLIC_CL_CLIENT_ID,
    endpoint: NEXT_PUBLIC_CL_ENDPOINT,
    scope: `market:all`
  })
    .then(auth => {
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

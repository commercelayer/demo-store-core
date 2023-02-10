// @ts-check

const { resolve } = require('path')
const { isSupportedUrl } = require('./src/utils/isSupportedUrl')

/** @type { import('./additional-env').DemoStoreEnvs } */
const envs = require('./src/utils/envs')

/** @type { import('next').NextConfig } */
const nextConfig = {
  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ['page.tsx', `page-${envs.NEXT_PUBLIC_DATA_FETCHING}.tsx`],

  // https://nextjs.org/docs/advanced-features/output-file-tracing
  output: 'standalone',

  // https://nextjs.org/docs/api-reference/next.config.js/basepath
  basePath: envs.NEXT_PUBLIC_BASE_PATH.length > 1 ? envs.NEXT_PUBLIC_BASE_PATH : undefined,

  eslint: {
    // https://nextjs.org/docs/basic-features/eslint#linting-custom-directories-and-files
    dirs: ['src']
  },

  env: envs,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    config.resolve.alias['#config'] = resolve(__dirname, envs.NEXT_PUBLIC_CONFIG_FOLDER)
    config.resolve.alias['aliasJsonData'] = resolve(__dirname, isSupportedUrl(envs.NEXT_PUBLIC_JSON_DATA_FOLDER) ? 'empty' : envs.NEXT_PUBLIC_JSON_DATA_FOLDER)
    config.resolve.alias['aliasLocalesData'] = resolve(__dirname, isSupportedUrl(envs.NEXT_PUBLIC_LOCALES_DATA_FOLDER) ? 'empty' : envs.NEXT_PUBLIC_LOCALES_DATA_FOLDER)

    return config
  }
}

const withPWA = require('next-pwa')({
  // disable: process.env.NODE_ENV === 'development',
  dest: 'public'
})

module.exports = withPWA(nextConfig)

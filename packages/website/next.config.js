// @ts-check

const { resolve } = require('path')
const { isSupportedUrl } = require('./src/utils/isSupportedUrl')

// Handle default value for env variables
const NEXT_PUBLIC_CONFIG_FOLDER = process.env.NEXT_PUBLIC_CONFIG_FOLDER || 'config/'
const NEXT_PUBLIC_JSON_DATA_FOLDER = process.env.NEXT_PUBLIC_JSON_DATA_FOLDER || 'data/json/'
const NEXT_PUBLIC_LOCALES_DATA_FOLDER = process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER || 'data/locales/'

/** @type { import('./@typings/general.config').GeneralConfig } */
const generalConfig = require('./config/general.config')

/** @type { import('next').NextConfig } */
const nextConfig = {
  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ['page.tsx', `page-${generalConfig.dataFetching}.tsx`],

  // https://nextjs.org/docs/api-reference/next.config.js/basepath
  basePath: generalConfig.basePath.length > 1 ? generalConfig.basePath : undefined,

  eslint: {
    // https://nextjs.org/docs/basic-features/eslint#linting-custom-directories-and-files
    dirs: ['src']
  },

  env: {
    NEXT_PUBLIC_CONFIG_FOLDER,
    NEXT_PUBLIC_JSON_DATA_FOLDER,
    NEXT_PUBLIC_LOCALES_DATA_FOLDER
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    config.resolve.alias['#config'] = resolve(__dirname, NEXT_PUBLIC_CONFIG_FOLDER)
    config.resolve.alias['aliasJsonData'] = resolve(__dirname, isSupportedUrl(NEXT_PUBLIC_JSON_DATA_FOLDER) ? 'empty' : NEXT_PUBLIC_JSON_DATA_FOLDER)
    config.resolve.alias['aliasLocalesData'] = resolve(__dirname, isSupportedUrl(NEXT_PUBLIC_LOCALES_DATA_FOLDER) ? 'empty' : NEXT_PUBLIC_LOCALES_DATA_FOLDER)

    return config
  }
}

module.exports = nextConfig

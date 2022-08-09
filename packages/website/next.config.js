// @ts-check

const { resolve } = require('path')
const { isSupportedUrl } = require('./src/utils/isSupportedUrl')

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

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    config.resolve.alias['#config'] = resolve(__dirname, process.env.NEXT_PUBLIC_CONFIG_FOLDER || 'config/')

    if (!process.env.NEXT_PUBLIC_JSON_DATA_FOLDER) {
      throw new Error('NEXT_PUBLIC_JSON_DATA_FOLDER env variable must be defined!')
    }

    if (isSupportedUrl(process.env.NEXT_PUBLIC_JSON_DATA_FOLDER)) {
      config.resolve.alias.aliasJsonData = resolve(__dirname, 'empty')
    } else {
      config.resolve.alias.aliasJsonData = resolve(__dirname, process.env.NEXT_PUBLIC_JSON_DATA_FOLDER)
    }

    if (!process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER) {
      throw new Error('NEXT_PUBLIC_LOCALES_DATA_FOLDER env variable must be defined!')
    }

    if (isSupportedUrl(process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER)) {
      config.resolve.alias.aliasLocalesData = resolve(__dirname, 'empty')
    } else {
      config.resolve.alias.aliasLocalesData = resolve(__dirname, process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER)
    }

    return config
  }
}

module.exports = nextConfig

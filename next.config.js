// @ts-check

/** @type { import('./@typings/general.config').GeneralConfig } */
const generalConfig = require('./config/general.config')

/** @type { import('next').NextConfig } */
const nextConfig = {
  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ['page.tsx', `page-${generalConfig.dataFetching}.tsx`],

  // https://nextjs.org/docs/api-reference/next.config.js/basepath
  basePath: generalConfig.basePath,

  eslint: {
    // https://nextjs.org/docs/basic-features/eslint#linting-custom-directories-and-files
    dirs: ['src']
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config;
  },

  // https://nextjs.org/docs/api-reference/next.config.js/environment-variables
  env: {
    // https://stackoverflow.com/a/57368145
    PROJECT_ROOT: __dirname
  }
}

module.exports = nextConfig

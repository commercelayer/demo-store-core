// @ts-check

/** @type { import('@typings/general.config.d').GeneralConfig } */
const generalConfig = {
  productSlugRegExp: /^.*\/(?<productCode>[A-Z0-9\-\_]+)$/,
  dataFetching: 'ssg',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || ''
}

module.exports = generalConfig

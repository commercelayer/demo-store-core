// @ts-check

/** @type { import('@typings/general.config.d').GeneralConfig } */
const generalConfig = {
  productSlugRegExp: /^.*\/(?<productCode>[A-Z0-9\-\_]+)$/,
  dataFetching: 'ssg',
  basePath: '/demo-store'
}

module.exports = generalConfig

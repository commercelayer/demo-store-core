// @ts-check

const getDataFetching = () => {
  if (process.env.NEXT_PUBLIC_DATA_FETCHING === 'ssr' || process.env.NEXT_PUBLIC_DATA_FETCHING === 'ssg') {
    return process.env.NEXT_PUBLIC_DATA_FETCHING
  }

  return 'ssg'
}

/** @type { import('@typings/general.config.d').GeneralConfig } */
const generalConfig = {
  productSlugRegExp: /^.*\/(?<productCode>[A-Z0-9\-\_]+)$/,
  dataFetching: getDataFetching(),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'
}

module.exports = generalConfig

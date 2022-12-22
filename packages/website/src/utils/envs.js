// @ts-check

const getDataFetching = () => {
  const NEXT_PUBLIC_DATA_FETCHING = process.env.NEXT_PUBLIC_DATA_FETCHING

  if (NEXT_PUBLIC_DATA_FETCHING === 'ssr' || NEXT_PUBLIC_DATA_FETCHING === 'ssg') {
    return NEXT_PUBLIC_DATA_FETCHING
  }

  return 'ssg'
}

const getSiteUrl = () => {
  const SITE_URL = process.env.SITE_URL
  if (SITE_URL === undefined) {
    return
  }

  return SITE_URL.replace(/[\/]+$/, '')
}

/** @type { import('additional-env').DemoStoreEnvs } */
const envs = {
  SITE_URL: getSiteUrl(),
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  NEXT_PUBLIC_CONFIG_FOLDER: process.env.NEXT_PUBLIC_CONFIG_FOLDER || 'config/',
  NEXT_PUBLIC_DATA_FETCHING: getDataFetching(),
  NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  NEXT_PUBLIC_JSON_DATA_FOLDER: process.env.NEXT_PUBLIC_JSON_DATA_FOLDER || 'data/json/',
  NEXT_PUBLIC_LOCALES_DATA_FOLDER: process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER || 'data/locales/',
}

module.exports = envs

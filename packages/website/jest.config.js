// jest.config.js
const nextJest = require('next/jest')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

// 
process.env.NEXT_PUBLIC_JSON_DATA_FOLDER ||= 'data/json/'
process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER ||= 'data/locales/'
process.env.NEXT_PUBLIC_CONFIG_FOLDER ||= 'config/'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
  const nextConfig = await createJestConfig(customJestConfig)()

  /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
  const jestConfig = {
    ...nextConfig,
    transformIgnorePatterns: [
      // CSS modules are mocked so they don't need to be transformed
      '^.+\\.module\\.(css|sass|scss)$',
      // @commercelayer/react-components is ESM
      'node_modules/(?!@commercelayer/react-components|swiper|ssr-window|dom7)',
    ],
    moduleNameMapper: {
      '\\.svg$': '<rootDir>/__mocks__/svg.jsx',
      ...pathsToModuleNameMapper(compilerOptions.paths),
      ...(nextConfig.moduleNameMapper || {}),
      'aliasJsonData(.*)': `<rootDir>/${process.env.NEXT_PUBLIC_JSON_DATA_FOLDER}$1`,
      'aliasLocalesData(.*)': `<rootDir>/${process.env.NEXT_PUBLIC_LOCALES_DATA_FOLDER}$1`,
      '#config(.*)': `<rootDir>/${process.env.NEXT_PUBLIC_CONFIG_FOLDER}$1`,
    }
  }

  return jestConfig
}

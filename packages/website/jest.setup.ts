import '@testing-library/jest-dom/extend-expect'

const env = process.env

beforeEach(() => {
  process.env = { ...env }
})

afterEach(() => {
  process.env = env
})

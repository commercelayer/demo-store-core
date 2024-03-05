import '@testing-library/jest-dom'

const env = process.env

beforeEach(() => {
  process.env = { ...env }
})

afterEach(() => {
  process.env = env
})

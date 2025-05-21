import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

const env = process.env

Object.assign(global, { TextDecoder, TextEncoder });

beforeEach(() => {
  process.env = { ...env }
})

afterEach(() => {
  process.env = env
})

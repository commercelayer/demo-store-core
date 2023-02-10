import { existsSync } from 'fs'
import { testJsonData } from './data'

const path = process.argv[2]

if (!path || !existsSync(path)) {
  throw new Error(`Folder "${path}" doesn't exist!`)
}

testJsonData(path)

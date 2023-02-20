// @ts-check

const { resolve, sep } = require('path')
const { testJsonData } = require('@commercelayer/demo-store-types/dist/test')

const { NEXT_PUBLIC_JSON_DATA_FOLDER = resolve('data', 'json') } = process.env

console.log('Running jsonData tests on:')
console.log(`  ${resolve(NEXT_PUBLIC_JSON_DATA_FOLDER)}${sep}\n`)

testJsonData(NEXT_PUBLIC_JSON_DATA_FOLDER)

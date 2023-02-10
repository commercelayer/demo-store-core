// @ts-check

const { testJsonData } = require('@commercelayer/demo-store-types/dist/test')

process.env.NEXT_PUBLIC_JSON_DATA_FOLDER ||= 'data/json/'

testJsonData(process.env.NEXT_PUBLIC_JSON_DATA_FOLDER)

import { rawDataProducts_schema } from '@commercelayer/demo-store-types'
import productsJson from '#__mocks__/json/products.json'

export default rawDataProducts_schema.parse(productsJson)
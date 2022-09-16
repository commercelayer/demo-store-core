import { execSync } from 'child_process'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { createCommerceLayerClient, getCurrentApplicationInfo } from './utils/application'

import prices from '../data/prices.json'
import skus from '../data/skus.json'
import stock_items from '../data/stock_items.json'

(async () => {

  const currentApplicationInfo = getCurrentApplicationInfo()
  const commerceLayer = await createCommerceLayerClient(currentApplicationInfo)

  // ----------------------------------------------------------------------------------------------------

  // Execute Seed
  execSync('commercelayer seeder:seed -b custom -n demo_store -u ./', {
    stdio: 'inherit'
  })

  // ----------------------------------------------------------------------------------------------------

  /**
   * Import Order:
   *  - skus --> shipping_categories
   *  - stock_items --> stock_locations
   *  - prices --> price_lists
   */

  // ----------------------------------------------------------------------------------------------------

  const shipping_categories = await commerceLayer.shipping_categories.list({ pageSize: 25, fields: ['id', 'reference'] })

  const resolvedSkus = skus.reduce((acc, item) => {
    const shipping_category_id = shipping_categories.find(el => el.reference === item.shipping_category)!.id

    acc[shipping_category_id] = acc[shipping_category_id] || []
    acc[shipping_category_id].push({
      reference: item.reference,
      code: item.code,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      shipping_category_id: shipping_category_id
    })

    return acc

  }, {} as {
    [shipping_category_id: string]: {
      reference: string
      code: string
      name: string
      description: string
      image_url: string
      shipping_category_id: string
    }[]
  })

  for (const [_parentId, skus] of Object.entries(resolvedSkus)) {
    const jsonFile = './tmp/skus.json'

    mkdirSync(dirname(jsonFile), { recursive: true })
    writeFileSync(jsonFile, JSON.stringify(skus, undefined, 2))

    const command = `commercelayer imports:create -t skus -i ${jsonFile}`
    console.log(command)
    execSync(command, {
      stdio: 'inherit'
    })

    rmSync(dirname(jsonFile), { recursive: true })
  }

  // ----------------------------------------------------------------------------------------------------

  const stock_locations = await commerceLayer.stock_locations.list({ pageSize: 25, fields: ['id', 'reference'] })

  const resolvedStockItems = stock_items.reduce((acc, item) => {
    const stock_location_id = stock_locations.find(el => el.reference === item.stock_location)!.id

    acc[stock_location_id] = acc[stock_location_id] || []
    acc[stock_location_id].push({
      reference: item.reference,
      sku_code: item.sku_code,
      quantity: item.quantity
    })

    return acc

  }, {} as {
    [stock_location_id: string]: {
      reference: string
      sku_code: string
      quantity: number
    }[]
  })

  for (const [parentId, stock_items] of Object.entries(resolvedStockItems)) {
    const jsonFile = './tmp/stock_items.json'

    mkdirSync(dirname(jsonFile), { recursive: true })
    writeFileSync(jsonFile, JSON.stringify(stock_items, undefined, 2))

    const command = `commercelayer imports:create -t stock_items -p ${parentId} -i ${jsonFile}`
    console.log(command)
    execSync(command, {
      stdio: 'inherit'
    })

    rmSync(dirname(jsonFile), { recursive: true })
  }

  // ----------------------------------------------------------------------------------------------------

  const price_lists = await commerceLayer.price_lists.list({ pageSize: 25, fields: ['id', 'reference'] })

  const resolvedPriceLists = prices.reduce((acc, item) => {
    const price_list_id = price_lists.find(el => el.reference === item.price_list)!.id

    acc[price_list_id] = acc[price_list_id] || []
    acc[price_list_id].push({
      reference: item.reference,
      sku_code: item.sku_code,
      amount_cents: item.amount_cents,
      compare_at_amount_cents: item.compare_at_amount_cents
    })

    return acc

  }, {} as {
    [price_list_id: string]: {
      reference: string
      sku_code: string
      amount_cents: number
      compare_at_amount_cents: number
    }[]
  })

  for (const [parentId, prices] of Object.entries(resolvedPriceLists)) {
    const jsonFile = './tmp/prices.json'

    mkdirSync(dirname(jsonFile), { recursive: true })
    writeFileSync(jsonFile, JSON.stringify(prices, undefined, 2))

    const command = `commercelayer imports:create -t prices -p ${parentId} -i ${jsonFile}`
    console.log(command)
    execSync(command, {
      stdio: 'inherit'
    })

    rmSync(dirname(jsonFile), { recursive: true })
  }
})()
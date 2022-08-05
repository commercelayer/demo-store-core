import { createCommerceLayerClient, getCurrentApplicationInfo } from './utils/application'

(async () => {
  const currentApplicationInfo = getCurrentApplicationInfo()
  const commerceLayer = await createCommerceLayerClient(currentApplicationInfo)

  const markets = await commerceLayer.markets.list({
    fields: ['number', 'name']
  })

  console.info('Your organization has', markets.length, 'markets:')
  for (const market of markets) {
    console.info(' - ', market.name, 'with number', market.number)
  }

})()

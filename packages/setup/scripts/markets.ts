import util from 'util'
import { createCommerceLayerClient, getCurrentApplicationInfo } from './utils/application'

(async () => {
  const currentApplicationInfo = getCurrentApplicationInfo()
  const commerceLayer = await createCommerceLayerClient(currentApplicationInfo)

  const markets = await commerceLayer.markets.list({
    fields: ['name', 'id', 'code', 'number']
  })

  console.info('Your organization has', markets.length, 'markets:')

  for (const market of markets) {
    console.info(`\n - ${market.name}`)
    console.info(
      util.inspect(
        {
          id: market.id,
          code: market.code
        },
        {
          colors: true,
          compact: false
        }
      )
    )
  }

})()

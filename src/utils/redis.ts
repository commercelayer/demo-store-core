import { createClient } from 'redis'

export const redisClient = async () => {
  const client = createClient()

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()

  return client
}

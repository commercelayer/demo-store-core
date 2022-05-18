import { createContext } from 'react'

export type Context = {
  accessToken: string
  endpoint: string
  organization: string
  domain: string
}

const AuthContext = createContext<Partial<Context>>({})

export default AuthContext

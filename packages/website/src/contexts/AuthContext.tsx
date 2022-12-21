import { createContext, useContext } from 'react'

type Context = {
  accessToken: string
  domain: string
  endpoint: string
  organization: string
}

type Props = {
  children?: React.ReactNode
} & Context

const AuthContext = createContext<Partial<Context>>({})

export const AuthProvider: React.FC<Props> = ({ children, ...props }) => (
  <AuthContext.Provider value={{ ...props }}>
    {children}
  </AuthContext.Provider>
)

export const useAuthContext = () => useContext(AuthContext)

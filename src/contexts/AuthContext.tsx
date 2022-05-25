import { createContext, useContext } from 'react'

type Context = {
  accessToken: string
  domain: string
  endpoint: string
  organization: string
}

const AuthContext = createContext<Partial<Context>>({})

export const AuthProvider: React.FC<Context> = ({ children, ...props }) => (
  <AuthContext.Provider value={{ ...props }}>
    {children}
  </AuthContext.Provider>
)

export const useAuthContext = () => useContext(AuthContext)

import { getRawDataOrganization, RawDataOrganization } from '#data/organization'
import { createContext, useContext } from 'react'

type Context = {
  organization: RawDataOrganization
}

const SettingsContext = createContext<Partial<Context>>({})

export const SettingsProvider: React.FC<Context> = ({ children, ...props }) => (
  <SettingsContext.Provider value={{ ...props }}>
    {children}
  </SettingsContext.Provider>
)

export const useSettingsContext = () => useContext(SettingsContext)

export const serverSideSettings = async (): Promise<SettingsContextProps> => {
  return {
    settingsContext: {
      organization: await getRawDataOrganization()
    }
  }
}

type SettingsContextProps = {
  settingsContext: Context
}

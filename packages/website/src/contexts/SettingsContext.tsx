import { getRawDataOrganization } from '#data/organization'
import { getLocale, type Locale } from '#i18n/locale'
import { memoize } from '#utils/memoize'
import type { RawDataOrganization } from '@commercelayer/demo-store-types'
import { createContext, useContext } from 'react'

export type SettingsContext = {
  organization: RawDataOrganization & {
    slug: string | null
  }
  locale: Locale
}

const SettingsContext = createContext<Partial<SettingsContext>>({})

export const SettingsProvider: React.FC<SettingsContext & { children: React.ReactNode }> = ({ children, ...props }) => (
  <SettingsContext.Provider value={{ ...props }}>
    {children}
  </SettingsContext.Provider>
)

export const useSettingsContext = () => useContext(SettingsContext)

export const serverSideSettings = memoize(
  async (localeCode: string): Promise<SettingsContextProps> => {
    return {
      settingsContext: {
        organization: {
          ...await getRawDataOrganization(),
          slug: process.env.NEXT_PUBLIC_CL_ENDPOINT?.match(/^https?:\/\/([\w-]+)/)?.[1] || null
        },
        locale: await getLocale(localeCode),
      }
    }
  }
)

type SettingsContextProps = {
  settingsContext: SettingsContext
}

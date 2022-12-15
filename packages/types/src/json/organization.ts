import { z } from 'zod'

const organization_schema = z.object({
  /**
   * 
   */
  name: z.string().optional(),

  /**
   * 
   */
  logo_url: z.string().optional(),

  /**
   * 
   */
  favicon_url: z.string().optional(),

  /**
   * 
   */
  primary_color: z.string().optional(),

  /**
   * 
   */
  manifest: z.string().optional(),
})

export const rawDataOrganization_schema = organization_schema

export type RawDataOrganization = z.infer<typeof organization_schema>

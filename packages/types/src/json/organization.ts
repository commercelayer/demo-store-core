import { z } from 'zod'

const organization_schema = z.object({
  // id: z.string(),
  // type: z.string(),

  // created_at: z.string(),
  // updated_at: z.string(),
  // reference: z.string().optional(),
  // reference_origin: z.string().optional(),
  // metadata: z.object({}).catchall(z.any()),

  name: z.string().optional(),
  slug: z.string().optional(),
  // domain: z.string().optional(),
  // support_phone: z.string().optional(),
  // support_email: z.string().optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: z.string().optional(),
  // contrast_color: z.string().optional(),
  // gtm_id: z.string().optional(),
  // gtm_id_test: z.string().optional(),
  // discount_disabled: z.boolean().optional(),
  // account_disabled: z.boolean().optional(),
  // acceptance_disabled: z.boolean().optional(),
  // max_concurrent_promotions: z.number().optional(),
  // max_concurrent_imports: z.number().optional(),

  manifest: z.string().optional(),
})

export const rawDataOrganization_schema = organization_schema

export type RawDataOrganization = z.infer<typeof organization_schema>

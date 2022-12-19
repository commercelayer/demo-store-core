import { z } from 'zod'

type RawDataOrganizationSchema = z.ZodObject<{
  /**
   * The name of your organization
   */
  name: z.ZodOptional<z.ZodString>

  /**
   * Your brand's logo image URL
   */
  logo_url: z.ZodOptional<z.ZodString>

  /**
   * Your brand's favicon image URL
   */
  favicon_url: z.ZodOptional<z.ZodString>

  /**
   * Your brand's primary color HEX code
   * 
   * @example "#FF0000"
   */
  primary_color: z.ZodOptional<z.ZodString>

  /**
   * A custom `manifest.json` URL
   * 
   * The web app manifest is a JSON file that tells the browser about your Progressive Web App and how it should behave when installed on the user's desktop or mobile device.
   * A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched, among other things.
   * 
   * @see https://web.dev/add-manifest/
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
   * @example
   * ```json
   * {
   *   "name": "Commerce Layer's Demo Store",
   *   "short_name": "Demo Store",
   *   "description": "Demo Store is a fully static e-commerce solution (with SSR capability) powered by Commerce Layer.",
   *   "icons": [
   *     {
   *       "src": "/demo-store-core/icons/icon-48x48.png",
   *       "sizes": "48x48",
   *       "type": "image/png",
   *       "purpose": "maskable"
   *     }
   *   ]
   * }
   * ```
   */
  manifest: z.ZodOptional<z.ZodString>
}>

export const rawDataOrganization_schema: RawDataOrganizationSchema = z.object({
  name: z.string().optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: z.string().optional(),
  manifest: z.string().optional(),
})

/**
 * Organization settings
 */
export type RawDataOrganization = z.infer<RawDataOrganizationSchema>

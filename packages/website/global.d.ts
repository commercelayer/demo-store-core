declare namespace globalThis {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * Points to the root of the project.
     * @default __dirname
     */
    PROJECT_ROOT: string

    /**
     * Base url of your website. This is used when generating the sitemap.
     * @url [next-sitemap](https://www.npmjs.com/package/next-sitemap)
     * @example 'https://commercelayer.github.io/demo-store'
     */
    SITE_URL: string

    /**
     * Commerce Layer Sales Channel Client ID. Copy it from your organization dashboard.
     * @url [API Clients - Sales channel](https://docs.commercelayer.io/developers/api-clients#sales-channel)
     */
    NEXT_PUBLIC_CL_CLIENT_ID: string

    /**
     * Commerce Layer Sales Channel Endpoint. Copy it from your organization dashboard.
     * @url [API Clients - Sales channel](https://docs.commercelayer.io/developers/api-clients#sales-channel)
     */
    NEXT_PUBLIC_CL_ENDPOINT: string

    /**
     * Deploy a Next.js application under a sub-path of a domain
     * @see [Base path configuration](https://nextjs.org/docs/api-reference/next.config.js/basepath)
     */
    NEXT_PUBLIC_BASE_PATH?: string

    /**
     * Default language when translation is not found. This should be a valid language from `languages.json` files.
     * @default 'en'
     */
    NEXT_PUBLIC_DEFAULT_LANGUAGE?: string

    /**
     * Folder in which json data files are stored. This could be a local path or a remote URL.
     * @default 'json' 
     * @example 'https://example.com/json'
     */
    NEXT_PUBLIC_JSON_DATA_FOLDER?: string

    /**
     * Data fetching in Next.js allows you to render your content in different ways, depending on your application's use case.
     * 
     * @see  [Data Fetching](https://nextjs.org/docs/basic-features/data-fetching/overview)
     */
    NEXT_PUBLIC_DATA_FETCHING?: string

  }
}

declare module 'querystring' {
  interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
    locale: string
  }
}

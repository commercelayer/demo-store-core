declare namespace globalThis {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

declare namespace NodeJS {
  export interface ProcessEnv {
    SITE_URL: string
    NEXT_PUBLIC_CL_CLIENT_ID: string
    NEXT_PUBLIC_CL_ENDPOINT: string
  }
}

declare module 'querystring' {
  interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
    locale: string
  }
}

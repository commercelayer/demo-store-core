declare namespace globalThis {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

declare namespace NodeJS {
  export interface ProcessEnv {
    PROJECT_ROOT: string
    SITE_URL: string
    NEXT_PUBLIC_CL_CLIENT_ID: string
    NEXT_PUBLIC_CL_ENDPOINT: string
    NEXT_PUBLIC_JSON_DATA_FOLDER?: string
  }
}

declare module 'querystring' {
  interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
    locale: string
  }
}

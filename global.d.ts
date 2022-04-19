declare namespace globalThis {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_CL_CLIENT_ID: string
    NEXT_PUBLIC_CL_ENDPOINT: string
  }
}

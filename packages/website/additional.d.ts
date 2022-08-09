declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>

  export default content
}

declare namespace globalThis {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

declare module "#config/general.config" {
  import config from 'config/general.config'
  export = config
}

declare module "#config/facets.config" {
  import config from 'config/facets.config'
  export = config
}

declare module "#config/variants.config" {
  import config from 'config/variants.config'
  export = config
}

declare module 'querystring' {
  interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
    locale: string
  }
}

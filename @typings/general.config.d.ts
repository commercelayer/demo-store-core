export type GeneralConfig = {

  /**
   * The RegExp needs to extract the Product Code from a Product Slug using the named group `?<productCode>`
   * 
   * @example
   * /^.*\/(?<productCode>[A-Z0-9]+) $/
   */
  productSlugRegExp: RegExp,

  /**
   * Data fetching in Next.js allows you to render your content in different ways, depending on your application's use case.
   * 
   * @see  [Data Fetching](https://nextjs.org/docs/basic-features/data-fetching/overview)
   */
  dataFetching: 'ssg' | 'ssr',

  /**
   * Deploy a Next.js application under a sub-path of a domain
   *
   * @see [Base path configuration](https://nextjs.org/docs/api-reference/next.config.js/basepath)
   */
  basePath: string
}

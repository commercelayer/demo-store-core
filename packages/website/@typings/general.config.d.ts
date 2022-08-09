export type GeneralConfig = {

  /**
   * The RegExp needs to extract the Product Code from a Product Slug using the named group `?<productCode>`.
   * 
   * @example
   * /^.*\/(?<productCode>[A-Z0-9]+) $/
   */
  productSlugRegExp: RegExp,

}

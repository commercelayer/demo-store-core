type ItemWithSlug = {
  /**
   * Absolute URL should start with `/`.
   * 
   * @example /item-name/1234
   * */
  slug: string
}

export const getSearchUrl = (item: ItemWithSlug): string => {
  // TODO: remove slash from here (slug should already have a slash)
  return `/search/${item.slug}`
}

export const getProductUrl = (item: ItemWithSlug): string => {
  return `/product/${item.slug}`
}

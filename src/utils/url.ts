export const getSearchUrl = (slug: string): string => {
  return `/search/${slug}`
}

export const getProductUrl = (slug: string): string => {
  return `/product/${slug}`
}

export const getCartUrl = (): string => {
  return '/cart'
}

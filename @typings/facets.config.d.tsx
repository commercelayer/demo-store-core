type Config = {
  field: string
}

type TagType = {
  type: 'tag'
}

type PriceRangeType = {
  type: 'priceRange'
}

export type FacetConfig = Config & (
  TagType | PriceRangeType
)

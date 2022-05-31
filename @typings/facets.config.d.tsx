type Config = {
  field: string
}

type TagType = {
  type: 'tag'
}

type PriceRangeType = {
  type: 'priceRange'
}

type ColorType = {
  type: 'color'
}

export type FacetConfig = Config & (
  TagType | PriceRangeType | ColorType
)

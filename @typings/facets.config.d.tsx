import type { SortOrder } from '#utils/sort'

type Config = {
  field: string
  sortOrder?: SortOrder[]
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

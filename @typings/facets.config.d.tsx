import type { SortOrder } from '#utils/sort'

type Config = {
  field: string
  sortOrder?: SortOrder[]
}

type TagAppearance = {
  appearance: 'tag'
}

type PriceRangeAppearance = {
  appearance: 'priceRange'
}

type ColorSwatchAppearance = {
  appearance: 'colorSwatch'
}

export type FacetConfig = Config & (
  TagAppearance | PriceRangeAppearance | ColorSwatchAppearance
)

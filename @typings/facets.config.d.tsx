import type { SortOrder } from '#utils/sort'

type Config = {
  field: string
  sortOrder?: SortOrder[]
}

type ColorSwatchAppearance = {
  appearance: 'colorSwatch'
}

type PriceRangeAppearance = {
  appearance: 'priceRange'
}

type SwitchAppearance = {
  appearance: 'switch'
}

type TagAppearance = {
  appearance: 'tag'
}

export type FacetConfig = Config & (
  | ColorSwatchAppearance
  | PriceRangeAppearance
  | SwitchAppearance
  | TagAppearance
)

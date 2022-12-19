import type { SortingRule } from '../utils/sort'

type Config = {
  /**
   * Any product attribute key taken from `products.json` or any `facetKey` attribute value taken from `taxonomies.json`.
   */
  field: string

  /**
   * Define a list of sorting rules.
   */
  sortOrder?: SortingRule[]
}

type ColorSwatchAppearance = {
  /**
   * Make it appear like a color swatch.
   * 
   * The field value should be a valid css color value.
   * 
   * @example "#000000"
   */
  appearance: 'colorSwatch'
}

type PriceRangeAppearance = {
  /**
   * Make it appear like a price-range.
   * 
   * The field value should be an integer or float. Strings will be coerced to float.
   */
  appearance: 'priceRange'
}

type SwitchAppearance = {
  /**
   * Make it appear like a switch button (on/off)
   */
  appearance: 'switch'
}

type TagAppearance = {
  /**
   * Make it appear like a switchable button
   */
  appearance: 'tag'
}

export type FacetConfig = Config & (
  | ColorSwatchAppearance
  | PriceRangeAppearance
  | SwitchAppearance
  | TagAppearance
)

type Config = {
  /**
   * Any product attribute key taken from `products.json`.
   */
  field: string
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

type TagAppearance = {
  /**
   * Make it appear like a switchable button.
   */
  appearance: 'tag'
}

export type VariantConfig = Config & (
  | ColorSwatchAppearance
  | TagAppearance
)

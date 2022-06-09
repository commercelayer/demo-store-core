type Config = {
  field: string
}

type ColorSwatchAppearance = {
  appearance: 'colorSwatch'
}

type TagAppearance = {
  appearance: 'tag'
}

export type VariantConfig = Config & (
  | ColorSwatchAppearance
  | TagAppearance
)

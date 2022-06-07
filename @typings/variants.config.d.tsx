type Config = {
  field: string
}

type TagAppearance = {
  appearance: 'tag'
}

type ColorAppearance = {
  appearance: 'colorSwatch'
}

export type VariantConfig = Config & (
  TagAppearance | ColorAppearance
)

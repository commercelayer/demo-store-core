type Config = {
  field: string
}

type TagType = {
  type: 'tag'
}

type ColorType = {
  type: 'color'
}

export type VariantConfig = Config & (
  TagType | ColorType
)

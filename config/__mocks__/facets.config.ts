import type { FacetConfig } from '@typings/facets.config.d'

const facetsConfig: FacetConfig[] = [
  {
    field: 'gender',
    appearance: 'tag',
  },
  {
    field: 'category',
    appearance: 'tag',
  },
  {
    field: 'price.amount_float',
    appearance: 'priceRange',
  },
  {
    field: 'available',
    appearance: 'tag',
  },
  {
    field: 'color',
    appearance: 'colorSwatch',
  },
  {
    field: 'size',
    appearance: 'tag',
  },
  {
    field: 'facetA',
    appearance: 'tag',
  },
]

export default facetsConfig

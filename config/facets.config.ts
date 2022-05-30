import type { FacetConfig } from '@typings/facets.config.d'

const facetsConfig: FacetConfig[] = [
  { type: 'tag', field: 'gender' },
  { type: 'tag', field: 'category' },
  { type: 'priceRange', field: 'price.amount_float' },
  { type: 'tag', field: 'color' },
  { type: 'tag', field: 'size' }
]

export default facetsConfig

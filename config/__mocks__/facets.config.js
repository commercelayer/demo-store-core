// @ts-check

/** @type { import('../../@typings/facets.config.d').FacetConfig[] } */
const facetsConfig = [
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
    appearance: 'switch',
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

module.exports = facetsConfig

import type { FacetConfig } from '@typings/facets.config.d'

const facetsConfig: FacetConfig[] = [
  {
    field: 'gender',
    appearance: 'tag',
    // sortOrder: [
    //   { pattern: /.*/, sort: values => values.sort()}
    // ]
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
    sortOrder: [
      {
        pattern: /^[0-9]+ months$/,
        sort: values => values.sort((a, b) => parseInt(a.toString()) - parseInt(b.toString()))
      },
      {
        pattern: /^[X/S]+S$/i,
        sort: values => values.sort((a, b) => b.toString().localeCompare(a.toString()))
      },
      { pattern: /^S$/i },
      { pattern: /^M$/i },
      { pattern: /^L$/i },
      { pattern: /^[X]+L$/i },
      { pattern: /^[4-9]XL$/i },
      {
        pattern: /^[0-9\.\,]+?$/,
        sort: values => values.sort((a, b) => {
          return parseFloat(a.toString().replace(',', '.')) - parseFloat(b.toString().replace(',', '.'))
        })
      }
    ]
  },
]

export default facetsConfig

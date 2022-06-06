import type { FacetConfig } from '@typings/facets.config.d'

const facetsConfig: FacetConfig[] = [
  {
    type: 'tag',
    field: 'gender',
    // sortOrder: [
    //   { pattern: /.*/, sort: values => values.sort()}
    // ]
  },
  {
    type: 'tag',
    field: 'category'
  },
  {
    type: 'priceRange',
    field: 'price.amount_float'
  },
  {
    type: 'tag',
    field: 'available'
  },
  {
    type: 'color',
    field: 'color'
  },
  {
    type: 'tag',
    field: 'size',
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

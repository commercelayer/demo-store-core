import type { Variant } from '#utils/products'
import { compareVariants, getOptions, previousSelectionMatches } from './VariantSelector.utils'

describe('previousSelectionMatches', () => {
  it('should always returns true when there\'s no a previous selection', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        0
      )
    ).toStrictEqual(true)
  })

  it('should returns TRUE when previous selection matches', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        1
      )
    ).toStrictEqual(true)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        2
      )
    ).toStrictEqual(true)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        3
      )
    ).toStrictEqual(true)
  })

  it('should returns FALSE when previous selection does not matching', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'plastic' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        1
      )
    ).toStrictEqual(false)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'yellow' },
          { name: 'size', value: 'small' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        2
      )
    ).toStrictEqual(false)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'large' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'red' },
          { name: 'size', value: 'small' }
        ],
        3
      )
    ).toStrictEqual(false)
  })
})

describe('getOptions', () => {
  const variants: Variant[][] = [
    [
      { name: 'material', value: 'metal' },
      { name: 'color', value: 'red' },
    ],
    [
      { name: 'material', value: 'wood' },
      { name: 'color', value: 'red' },
      { name: 'size', value: 'small' }
    ],
    [
      { name: 'material', value: 'plastic' },
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'medium' }
    ],
    [
      { name: 'material', value: 'metal' },
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'large' }
    ],
    [
      { name: 'material', value: 'wood' },
      { name: 'color', value: 'yellow' },
      { name: 'size', value: 'large' }
    ],
    [
      { name: 'material', value: 'wood' },
      { name: 'color', value: 'yellow' },
      { name: 'size', value: 'small' }
    ],
    [
      { name: 'material', value: 'wood' },
      { name: 'color', value: 'yellow' },
      { name: 'size', value: 'huge' }
    ],
    [
      { name: 'material', value: 'wood' },
      { name: 'color', value: 'green' }
    ]
  ]

  it('should returns a list of available variants based on the provided current selection', () => {
    expect(getOptions(variants, [])).toStrictEqual([
      [
        { name: 'material', value: 'metal' },
        { name: 'material', value: 'wood' },
        { name: 'material', value: 'plastic' }
      ],
      [],
      []
    ])

    expect(getOptions(variants, [{ name: 'material', value: 'metal' }])).toStrictEqual([
      [
        { name: 'material', value: 'metal' },
        { name: 'material', value: 'wood' },
        { name: 'material', value: 'plastic' }
      ],
      [
        { name: 'color', value: 'red' },
        { name: 'color', value: 'blue' },
      ],
      []
    ])

    expect(
      getOptions(variants, [
        { name: 'material', value: 'metal' },
        { name: 'color', value: 'blue' }
      ])
    ).toStrictEqual([
      [
        { name: 'material', value: 'metal' },
        { name: 'material', value: 'wood' },
        { name: 'material', value: 'plastic' }
      ],
      [
        { name: 'color', value: 'red' },
        { name: 'color', value: 'blue' }
      ],
      [{ name: 'size', value: 'large' }]
    ])

    expect(
      getOptions(variants, [
        { name: 'material', value: 'metal' },
        { name: 'color', value: 'blue' },
        { name: 'size', value: 'large' }
      ])
    ).toStrictEqual([
      [
        { name: 'material', value: 'metal' },
        { name: 'material', value: 'wood' },
        { name: 'material', value: 'plastic' }
      ],
      [
        { name: 'color', value: 'red' },
        { name: 'color', value: 'blue' }
      ],
      [{ name: 'size', value: 'large' }]
    ])
  })
})

describe('compareVariants', () => {
  it('should returns TRUE when provided variants are equivalent', () => {
    expect(compareVariants([], [])).toBe(true)

    expect(
      compareVariants(
        [{ name: 'material', value: 'metal' }],
        [{ name: 'material', value: 'metal' }]
      )
    ).toBe(true)

    expect(
      compareVariants(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'blue' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'blue' }
        ]
      )
    ).toBe(true)
  })

  it('should returns FALSE when provided variants are NOT equivalent', () => {
    expect(
      compareVariants(
        [{ name: 'material', value: 'metal' }],
        [{ name: 'material', value: 'plastic' }]
      )
    ).toBe(false)

    expect(
      compareVariants(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'blue' }
        ],
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'green' }
        ]
      )
    ).toBe(false)

    expect(
      compareVariants(
        [
          { name: 'material', value: 'metal' },
          { name: 'color', value: 'blue' }
        ],
        [
          { name: 'material', value: 'metal' }
        ]
      )
    ).toBe(false)
  })
})
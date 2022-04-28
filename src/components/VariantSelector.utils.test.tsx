import { LocalizedVariant } from '#data/products'
import { compareVariants, getOptions, previousSelectionMatches } from './VariantSelector.utils'

describe('previousSelectionMatches', () => {
  it('should always returns true when there\'s no a previous selection', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        0
      )
    ).toStrictEqual(true)
  })

  it('should returns TRUE when previous selection matches', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        1
      )
    ).toStrictEqual(true)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        2
      )
    ).toStrictEqual(true)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        3
      )
    ).toStrictEqual(true)
  })

  it('should returns FALSE when previous selection does not matching', () => {
    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'plastic', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        1
      )
    ).toStrictEqual(false)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'yellow', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        2
      )
    ).toStrictEqual(false)

    expect(
      previousSelectionMatches(
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'large', label: '' }
        ],
        [
          { name: 'material', value: 'metal', label: '' },
          { name: 'color', value: 'red', label: '' },
          { name: 'size', value: 'small', label: '' }
        ],
        3
      )
    ).toStrictEqual(false)
  })
})

describe('getOptions', () => {
  const variants: LocalizedVariant[][] = [
    [
      { name: 'material', value: 'metal', label: '' },
      { name: 'color', value: 'red', label: '' },
    ],
    [
      { name: 'material', value: 'wood', label: '' },
      { name: 'color', value: 'red', label: '' },
      { name: 'size', value: 'small', label: '' }
    ],
    [
      { name: 'material', value: 'plastic', label: '' },
      { name: 'color', value: 'blue', label: '' },
      { name: 'size', value: 'medium', label: '' }
    ],
    [
      { name: 'material', value: 'metal', label: '' },
      { name: 'color', value: 'blue', label: '' },
      { name: 'size', value: 'large', label: '' }
    ],
    [
      { name: 'material', value: 'wood', label: '' },
      { name: 'color', value: 'yellow', label: '' },
      { name: 'size', value: 'large', label: '' }
    ],
    [
      { name: 'material', value: 'wood', label: '' },
      { name: 'color', value: 'yellow', label: '' },
      { name: 'size', value: 'small', label: '' }
    ],
    [
      { name: 'material', value: 'wood', label: '' },
      { name: 'color', value: 'yellow', label: '' },
      { name: 'size', value: 'huge', label: '' }
    ],
    [
      { name: 'material', value: 'wood', label: '' },
      { name: 'color', value: 'green', label: '' }
    ]
  ]

  it('should returns a list of available variants based on the provided current selection', () => {
    expect(getOptions(variants, [])).toStrictEqual([
      [
        { name: 'material', value: 'metal', label: '' },
        { name: 'material', value: 'wood', label: '' },
        { name: 'material', value: 'plastic', label: '' }
      ],
      [],
      []
    ])

    expect(getOptions(variants, [{ name: 'material', value: 'metal', label: '' }])).toStrictEqual([
      [
        { name: 'material', value: 'metal', label: '' },
        { name: 'material', value: 'wood', label: '' },
        { name: 'material', value: 'plastic', label: '' }
      ],
      [
        { name: 'color', value: 'red', label: '' },
        { name: 'color', value: 'blue', label: '' },
      ],
      []
    ])

    expect(
      getOptions(variants, [
        { name: 'material', value: 'metal', label: '' },
        { name: 'color', value: 'blue', label: '' }
      ])
    ).toStrictEqual([
      [
        { name: 'material', value: 'metal', label: '' },
        { name: 'material', value: 'wood', label: '' },
        { name: 'material', value: 'plastic', label: '' }
      ],
      [
        { name: 'color', value: 'red', label: '' },
        { name: 'color', value: 'blue', label: '' }
      ],
      [{ name: 'size', value: 'large', label: '' }]
    ])

    expect(
      getOptions(variants, [
        { name: 'material', value: 'metal', label: '' },
        { name: 'color', value: 'blue', label: '' },
        { name: 'size', value: 'large', label: '' }
      ])
    ).toStrictEqual([
      [
        { name: 'material', value: 'metal', label: '' },
        { name: 'material', value: 'wood', label: '' },
        { name: 'material', value: 'plastic', label: '' }
      ],
      [
        { name: 'color', value: 'red', label: '' },
        { name: 'color', value: 'blue', label: '' }
      ],
      [{ name: 'size', value: 'large', label: '' }]
    ])
  })
})

describe('compareVariants', () => {
  it('should returns TRUE when provided variants are equivalent', () => {
    expect(compareVariants([], [])).toBe(true)

    expect(
      compareVariants(
        [{ name: "material", value: "metal", label: "" }],
        [{ name: "material", value: "metal", label: "" }]
      )
    ).toBe(true)

    expect(
      compareVariants(
        [
          { name: "material", value: "metal", label: "" },
          { name: "color", value: "blue", label: "" }
        ],
        [
          { name: "material", value: "metal", label: "" },
          { name: "color", value: "blue", label: "" }
        ]
      )
    ).toBe(true)
  })

  it('should returns FALSE when provided variants are NOT equivalent', () => {
    expect(
      compareVariants(
        [{ name: "material", value: "metal", label: "" }],
        [{ name: "material", value: "plastic", label: "" }]
      )
    ).toBe(false)

    expect(
      compareVariants(
        [
          { name: "material", value: "metal", label: "" },
          { name: "color", value: "blue", label: "" }
        ],
        [
          { name: "material", value: "metal", label: "" },
          { name: "color", value: "green", label: "" }
        ]
      )
    ).toBe(false)

    expect(
      compareVariants(
        [
          { name: "material", value: "metal", label: "" },
          { name: "color", value: "blue", label: "" }
        ],
        [
          { name: "material", value: "metal", label: "" }
        ]
      )
    ).toBe(false)
  })
})
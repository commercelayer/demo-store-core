import type { Variant } from '#utils/products'
import uniqBy from 'lodash/uniqBy'

export const previousSelectionMatches = (current: Variant[], variant: Variant[], index: number): boolean => {
  if (index === 0) {
    return true
  }

  return (
    current[index - 1] &&
    current[index - 1].value === variant[index - 1].value &&
    previousSelectionMatches(current, variant, index - 1)
  )
}

export const getOptions = (variants: Variant[][], current: Variant[]) => {
  const maxLength = variants.reduce((a, b) => Math.max(a, b.length), -Infinity)
  return new Array(maxLength).fill(undefined).map((_, index) => {
    return uniqBy(
      variants
        .filter(variant => previousSelectionMatches(current, variant, index))
        .map((p) => p[index]),
      'value'
    )
  })
}

export const compareVariants = (variantA: Variant[], variantB: Variant[]): boolean => {
  const nameValueObject = (variant: Variant) => ({ name: variant.name, value: variant.value })
  return JSON.stringify(variantA.map(nameValueObject)) === JSON.stringify(variantB.map(nameValueObject))
}

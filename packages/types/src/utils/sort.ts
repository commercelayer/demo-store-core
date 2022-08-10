export type SortValue = string | boolean | number

export type SortingRule = {
  /**
   * RegExp to match the value.
   */
  pattern: RegExp

  /**
   * Sorting algorithm to apply.
   */
  sort?: <T extends SortValue>(values: T[]) => T[]
}

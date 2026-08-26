import {
  SIGNIFICANCE_ALPHA,
  isSignificant,
  type FeatureColumn,
} from '../types/dataset'

export interface ColumnFilterOptions {
  constructs: string[]
  significantOnly: boolean
  alpha?: number
}

/**
 * Choose which feature columns are visible in the table.
 * Empty `constructs` means "all constructs".
 */
export function filterFeatureColumns(
  columns: FeatureColumn[],
  options: ColumnFilterOptions,
): FeatureColumn[] {
  const alpha = options.alpha ?? SIGNIFICANCE_ALPHA
  const constructSet = new Set(options.constructs)

  return columns.filter((column) => {
    if (constructSet.size > 0 && !constructSet.has(column.construct)) {
      return false
    }
    if (options.significantOnly && !isSignificant(column, alpha)) {
      return false
    }
    return true
  })
}

export function uniqueConstructs(columns: FeatureColumn[]): string[] {
  return [...new Set(columns.map((c) => c.construct))].sort()
}

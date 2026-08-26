import { describe, expect, it } from 'vitest'
import { filterFeatureColumns, uniqueConstructs } from '../lib/filterColumns'
import type { FeatureColumn } from '../types/dataset'
import { isSignificant } from '../types/dataset'

const columns: FeatureColumn[] = [
  { id: 'a', label: 'A', construct: 'Pitch', pValue: 0.01 },
  { id: 'b', label: 'B', construct: 'Pitch', pValue: 0.2 },
  { id: 'c', label: 'C', construct: 'Rhythm', pValue: 0.04 },
  { id: 'd', label: 'D', construct: 'Tonalness', pValue: 0.5 },
]

describe('isSignificant', () => {
  it('uses alpha 0.05 by default', () => {
    expect(isSignificant(columns[0])).toBe(true)
    expect(isSignificant(columns[1])).toBe(false)
  })
})

describe('filterFeatureColumns', () => {
  it('returns all columns when no filters are set', () => {
    expect(
      filterFeatureColumns(columns, { constructs: [], significantOnly: false }),
    ).toHaveLength(4)
  })

  it('filters by construct', () => {
    const result = filterFeatureColumns(columns, {
      constructs: ['Pitch'],
      significantOnly: false,
    })
    expect(result.map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('filters by significance', () => {
    const result = filterFeatureColumns(columns, {
      constructs: [],
      significantOnly: true,
    })
    expect(result.map((c) => c.id)).toEqual(['a', 'c'])
  })

  it('combines construct and significance filters', () => {
    const result = filterFeatureColumns(columns, {
      constructs: ['Pitch'],
      significantOnly: true,
    })
    expect(result.map((c) => c.id)).toEqual(['a'])
  })
})

describe('uniqueConstructs', () => {
  it('returns sorted unique construct names', () => {
    expect(uniqueConstructs(columns)).toEqual(['Pitch', 'Rhythm', 'Tonalness'])
  })
})

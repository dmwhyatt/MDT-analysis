import { describe, expect, it } from 'vitest'
import { tomSelectValues } from './tomSelectValue'

describe('tomSelectValues', () => {
  it('returns a new array when given Tom Select items (same contents)', () => {
    const tomItems = ['Rhythm']
    const next = tomSelectValues(tomItems)
    expect(next).toEqual(['Rhythm'])
    expect(next).not.toBe(tomItems)
  })

  it('does not let later in-place mutation of Tom items affect the copy', () => {
    const tomItems = ['Rhythm']
    const next = tomSelectValues(tomItems)
    tomItems.length = 0
    expect(next).toEqual(['Rhythm'])
  })

  it('normalizes empty and single-string values', () => {
    expect(tomSelectValues([])).toEqual([])
    expect(tomSelectValues('Pitch')).toEqual(['Pitch'])
    expect(tomSelectValues('')).toEqual([])
  })
})

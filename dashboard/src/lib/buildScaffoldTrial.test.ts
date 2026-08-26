import { describe, expect, it } from 'vitest'
import { buildScaffoldTrial } from './buildScaffoldTrial'

describe('buildScaffoldTrial', () => {
  it('repeats the same MIDI across three positions', () => {
    const trial = buildScaffoldTrial('midi/melody_0001.mid')
    expect(trial).toHaveLength(3)
    expect(trial.map((o) => o.position)).toEqual([1, 2, 3])
    expect(trial.every((o) => o.midiPath === 'midi/melody_0001.mid')).toBe(true)
    expect(trial.map((o) => o.label)).toEqual(['1', '2', '3'])
  })
})

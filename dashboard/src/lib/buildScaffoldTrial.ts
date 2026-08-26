export type TrialPosition = 1 | 2 | 3

export interface TrialOption {
  position: TrialPosition
  label: string
  /** Path under public/, same for all options in the scaffold. */
  midiPath: string
}

/**
 * Scaffold a 3AFC trial by repeating the same MIDI at each position.
 * Real items will later supply distinct standard/foil paths.
 */
export function buildScaffoldTrial(midiPath: string): TrialOption[] {
  return ([1, 2, 3] as const).map((position) => ({
    position,
    label: String(position),
    midiPath,
  }))
}

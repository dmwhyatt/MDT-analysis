export type ConstructName = 'Pitch' | 'Tonalness' | 'Rhythm' | string

export interface FeatureColumn {
  id: string
  label: string
  construct: ConstructName
  /** Two-sided p-value vs the outcome variable (precomputed). */
  pValue: number
}

export interface MelodyRow {
  id: string
  midiPath: string
  features: Record<string, number>
}

export interface MelodyDataset {
  schemaVersion: number
  melodies: MelodyRow[]
  columns: FeatureColumn[]
}

export const SIGNIFICANCE_ALPHA = 0.05

export function isSignificant(column: FeatureColumn, alpha = SIGNIFICANCE_ALPHA): boolean {
  return column.pValue < alpha
}

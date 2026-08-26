import { describe, expect, it } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  it('joins a relative path onto the Vite base URL', () => {
    expect(assetUrl('data/melodies.json')).toMatch(/data\/melodies\.json$/)
    expect(assetUrl('/midi/melody_0001.mid')).toMatch(/midi\/melody_0001\.mid$/)
  })
})

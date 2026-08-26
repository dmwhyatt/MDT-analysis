import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'

export type MidiPlaybackHandle = {
  stop: () => void
  ended: Promise<void>
}

/**
 * Audio-only MIDI playback (no piano roll / notation).
 * Used by test mode so listeners cannot visually identify alternatives.
 */
export async function playMidiAudio(url: string): Promise<MidiPlaybackHandle> {
  await Tone.start()

  const midi = await Midi.fromUrl(url)
  const synth = new Tone.PolySynth(Tone.Synth, {
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.4 },
  }).toDestination()

  const startAt = Tone.now() + 0.05
  let lastEnd = startAt

  for (const track of midi.tracks) {
    for (const note of track.notes) {
      const when = startAt + note.time
      synth.triggerAttackRelease(note.name, note.duration, when, note.velocity)
      lastEnd = Math.max(lastEnd, when + note.duration)
    }
  }

  let stopped = false
  let endTimer = 0
  let settle!: () => void
  const ended = new Promise<void>((resolve) => {
    settle = resolve
  })

  const stop = () => {
    if (stopped) return
    stopped = true
    window.clearTimeout(endTimer)
    synth.releaseAll()
    synth.dispose()
    settle()
  }

  endTimer = window.setTimeout(stop, Math.max(200, (lastEnd - Tone.now() + 0.35) * 1000))

  return { stop, ended }
}

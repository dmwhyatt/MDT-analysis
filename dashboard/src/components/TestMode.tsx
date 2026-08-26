import { useEffect, useMemo, useRef, useState } from 'react'
import { assetUrl } from '../lib/assetUrl'
import { buildScaffoldTrial, type TrialPosition } from '../lib/buildScaffoldTrial'
import { playMidiAudio, type MidiPlaybackHandle } from '../lib/playMidiAudio'

interface TestModeProps {
  melodyId: string
  midiPath: string
  onExit: () => void
}

export function TestMode({ melodyId, midiPath, onExit }: TestModeProps) {
  const options = useMemo(() => buildScaffoldTrial(midiPath), [midiPath])
  const [choice, setChoice] = useState<TrialPosition | null>(null)
  const [submitted, setSubmitted] = useState<TrialPosition | null>(null)
  const [playing, setPlaying] = useState<TrialPosition | null>(null)
  const [playError, setPlayError] = useState<string | null>(null)
  const handleRef = useRef<MidiPlaybackHandle | null>(null)

  const stopPlayback = () => {
    handleRef.current?.stop()
    handleRef.current = null
    setPlaying(null)
  }

  useEffect(() => {
    return () => {
      handleRef.current?.stop()
      handleRef.current = null
    }
  }, [])

  const playOption = async (position: TrialPosition) => {
    const option = options.find((o) => o.position === position)
    if (!option) return

    if (playing === position) {
      stopPlayback()
      return
    }

    setPlayError(null)
    stopPlayback()
    setPlaying(position)

    try {
      const handle = await playMidiAudio(assetUrl(option.midiPath))
      handleRef.current = handle
      await handle.ended
      if (handleRef.current === handle) {
        handleRef.current = null
        setPlaying(null)
      }
    } catch (err) {
      handleRef.current = null
      setPlaying(null)
      setPlayError(err instanceof Error ? err.message : 'Playback failed')
    }
  }

  return (
    <section className="test-mode" aria-label="Melody item test">
      <div className="test-mode-header">
        <div>
          <h2>Test item: {melodyId}</h2>
          <p className="lede">
            Audio-only 3AFC scaffold — listen to each option (no piano roll or
            notation), then pick which one is the odd one out. For now all three
            play the same MIDI.
          </p>
        </div>
        <button type="button" className="btn" onClick={onExit}>
          Back to explore
        </button>
      </div>

      <p className="test-privacy" role="note">
        Visual MIDI is hidden in test mode so the odd one out must be identified
        by ear.
      </p>

      <div className="test-options" role="group" aria-label="Trial alternatives">
        {options.map((option) => {
          const isPlaying = playing === option.position
          const isChosen = choice === option.position
          return (
            <div
              key={option.position}
              className={[
                'test-option',
                isPlaying ? 'listening' : '',
                isChosen ? 'chosen' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="test-option-label">Option {option.label}</span>
              <button
                type="button"
                className={isPlaying ? 'btn primary' : 'btn'}
                aria-pressed={isPlaying}
                aria-label={
                  isPlaying
                    ? `Stop option ${option.label}`
                    : `Play option ${option.label}`
                }
                onClick={() => {
                  void playOption(option.position)
                }}
              >
                {isPlaying ? 'Stop' : 'Play'}
              </button>
              <button
                type="button"
                className={isChosen ? 'btn primary' : 'btn'}
                aria-pressed={isChosen}
                onClick={() => {
                  setChoice(option.position)
                  setSubmitted(null)
                }}
              >
                {isChosen
                  ? `Odd one out: option ${option.label}`
                  : `Pick option ${option.label}`}
              </button>
            </div>
          )
        })}
      </div>

      {playError ? (
        <p className="error" role="alert">
          {playError}
        </p>
      ) : null}

      <div className="test-actions">
        <button
          type="button"
          className="btn primary"
          disabled={choice === null}
          onClick={() => {
            if (choice !== null) setSubmitted(choice)
          }}
        >
          Submit choice
        </button>
        {submitted !== null ? (
          <p className="test-feedback" role="status">
            Recorded option {submitted} as the odd one out (scaffold — all three
            alternatives currently share the same MIDI).
          </p>
        ) : null}
      </div>
    </section>
  )
}

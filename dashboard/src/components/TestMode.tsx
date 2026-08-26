import { useMemo, useState } from 'react'
import { buildScaffoldTrial, type TrialPosition } from '../lib/buildScaffoldTrial'
import { MelodyPlayer } from './MelodyPlayer'

interface TestModeProps {
  melodyId: string
  midiPath: string
  onExit: () => void
}

export function TestMode({ melodyId, midiPath, onExit }: TestModeProps) {
  const options = useMemo(() => buildScaffoldTrial(midiPath), [midiPath])
  const [listeningTo, setListeningTo] = useState<TrialPosition>(1)
  const [choice, setChoice] = useState<TrialPosition | null>(null)
  const [submitted, setSubmitted] = useState<TrialPosition | null>(null)

  const active = options.find((o) => o.position === listeningTo) ?? options[0]

  return (
    <section className="test-mode" aria-label="Melody item test">
      <div className="test-mode-header">
        <div>
          <h2>Test item: {melodyId}</h2>
          <p className="lede">
            Scaffold 3AFC trial — the same MIDI is played at each position.
            Listen to all three, then pick which one is the odd one out.
          </p>
        </div>
        <button type="button" className="btn" onClick={onExit}>
          Back to explore
        </button>
      </div>

      <div className="test-options" role="group" aria-label="Trial alternatives">
        {options.map((option) => {
          const isListening = option.position === listeningTo
          const isChosen = choice === option.position
          return (
            <div
              key={option.position}
              className={[
                'test-option',
                isListening ? 'listening' : '',
                isChosen ? 'chosen' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="test-option-label">Option {option.label}</span>
              <button
                type="button"
                className="btn"
                aria-pressed={isListening}
                onClick={() => setListeningTo(option.position)}
              >
                {isListening ? 'Listening' : 'Play'}
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

      <MelodyPlayer
        melodyId={`${melodyId} · option ${active.label}`}
        midiPath={active.midiPath}
      />

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

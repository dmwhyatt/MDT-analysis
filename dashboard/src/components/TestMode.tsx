import { useEffect, useMemo, useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
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
    <section aria-label="Melody item test">
      <Stack
        direction="horizontal"
        gap={2}
        className="justify-content-between align-items-start flex-wrap mb-3"
      >
        <div>
          <h2 className="h4 mb-1">Test item: {melodyId}</h2>
          <p className="text-secondary mb-0">
            Audio-only 3AFC scaffold — listen to each option (no piano roll or
            notation), then pick which one is the odd one out. For now all three
            play the same MIDI.
          </p>
        </div>
        <Button variant="outline-secondary" onClick={onExit}>
          Back to explore
        </Button>
      </Stack>

      <Alert variant="success" role="note" className="mb-3">
        Visual MIDI is hidden in test mode so the odd one out must be identified
        by ear.
      </Alert>

      <Row className="g-3 mb-3" role="group" aria-label="Trial alternatives">
        {options.map((option) => {
          const isPlaying = playing === option.position
          const isChosen = choice === option.position
          return (
            <Col key={option.position} xs={12} md={4}>
              <Card
                className={[
                  'test-option h-100',
                  isPlaying ? 'listening' : '',
                  isChosen ? 'chosen' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Card.Body className="d-flex flex-column gap-2">
                  <Card.Title className="h6 mb-0">
                    Option {option.label}
                  </Card.Title>
                  <Button
                    variant={isPlaying ? 'primary' : 'outline-primary'}
                    active={isPlaying}
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
                  </Button>
                  <Button
                    variant={isChosen ? 'success' : 'outline-success'}
                    active={isChosen}
                    aria-pressed={isChosen}
                    onClick={() => {
                      setChoice(option.position)
                      setSubmitted(null)
                    }}
                  >
                    {isChosen
                      ? `Odd one out: option ${option.label}`
                      : `Pick option ${option.label}`}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {playError ? (
        <Alert variant="danger" role="alert">
          {playError}
        </Alert>
      ) : null}

      <Stack
        direction="horizontal"
        gap={3}
        className="align-items-center flex-wrap"
      >
        <Button
          variant="success"
          disabled={choice === null}
          onClick={() => {
            if (choice !== null) setSubmitted(choice)
          }}
        >
          Submit choice
        </Button>
        {submitted !== null ? (
          <p className="text-success mb-0" role="status">
            Recorded option {submitted} as the odd one out (scaffold — all three
            alternatives currently share the same MIDI).
          </p>
        ) : null}
      </Stack>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { ConstructSelect } from './components/ConstructSelect'
import { MelodyPlayer } from './components/MelodyPlayer'
import { MelodyTable } from './components/MelodyTable'
import { SignificanceToggle } from './components/SignificanceToggle'
import { TestMode } from './components/TestMode'
import { assetUrl } from './lib/assetUrl'
import { filterFeatureColumns, uniqueConstructs } from './lib/filterColumns'
import type { MelodyDataset } from './types/dataset'

type AppMode = 'explore' | 'test'

function App() {
  const [dataset, setDataset] = useState<MelodyDataset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [constructs, setConstructs] = useState<string[]>([])
  const [significantOnly, setSignificantOnly] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<AppMode>('explore')

  useEffect(() => {
    let cancelled = false
    fetch(assetUrl('data/melodies.json'))
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load dataset (${res.status})`)
        return res.json() as Promise<MelodyDataset>
      })
      .then((data) => {
        if (cancelled) return
        setDataset(data)
        setSelectedId(data.melodies[0]?.id ?? null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load dataset')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const constructOptions = useMemo(
    () => (dataset ? uniqueConstructs(dataset.columns) : []),
    [dataset],
  )

  const visibleColumns = useMemo(() => {
    if (!dataset) return []
    return filterFeatureColumns(dataset.columns, {
      constructs,
      significantOnly,
    })
  }, [dataset, constructs, significantOnly])

  const selectedMelody = useMemo(
    () => dataset?.melodies.find((m) => m.id === selectedId) ?? null,
    [dataset, selectedId],
  )

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      </Container>
    )
  }

  if (!dataset) {
    return (
      <Container className="py-4">
        <p className="text-secondary mb-0">Loading MDT fixture dataset…</p>
      </Container>
    )
  }

  return (
    <Container className="py-3 py-md-4">
      <Stack
        direction="horizontal"
        gap={2}
        className="justify-content-between align-items-start flex-wrap mb-2"
      >
        <h1 className="h3 mb-0">MDT analysis dashboard</h1>
        <ButtonGroup aria-label="App mode">
          <Button
            variant={mode === 'explore' ? 'primary' : 'outline-primary'}
            active={mode === 'explore'}
            onClick={() => setMode('explore')}
          >
            Explore
          </Button>
          <Button
            variant={mode === 'test' ? 'primary' : 'outline-primary'}
            active={mode === 'test'}
            disabled={!selectedMelody}
            onClick={() => setMode('test')}
          >
            Test
          </Button>
        </ButtonGroup>
      </Stack>
      <p className="text-secondary mb-3 mb-md-4">
        {mode === 'explore'
          ? 'Filter feature columns by construct and significance; select a row to inspect playback and piano roll, or open Test mode for a scaffold 3AFC trial.'
          : 'Attempt a scaffold melody item: listen to three alternatives and pick the odd one out.'}
      </p>

      {mode === 'test' && selectedMelody ? (
        <TestMode
          melodyId={selectedMelody.id}
          midiPath={selectedMelody.midiPath}
          onExit={() => setMode('explore')}
        />
      ) : (
        <>
          <Card className="mb-3">
            <Card.Body>
              <Row className="g-3 align-items-end" aria-label="Column filters">
                <Col xs={12} md={5} lg={4}>
                  <ConstructSelect
                    constructs={constructOptions}
                    selected={constructs}
                    onChange={setConstructs}
                  />
                </Col>
                <Col xs={12} md="auto">
                  <SignificanceToggle
                    checked={significantOnly}
                    onChange={setSignificantOnly}
                  />
                </Col>
                <Col xs={12} md className="text-md-end">
                  <p className="meta text-secondary small mb-0">
                    Showing {visibleColumns.length} of {dataset.columns.length}{' '}
                    feature columns · {dataset.melodies.length} melodies
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <MelodyTable
            melodies={dataset.melodies}
            columns={visibleColumns}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {selectedMelody ? (
            <Stack gap={3} className="mt-3">
              <div>
                <Button variant="success" onClick={() => setMode('test')}>
                  Try this item in test mode
                </Button>
              </div>
              <MelodyPlayer
                melodyId={selectedMelody.id}
                midiPath={selectedMelody.midiPath}
              />
            </Stack>
          ) : null}
        </>
      )}
    </Container>
  )
}

export default App

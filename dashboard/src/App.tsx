import { useEffect, useMemo, useState } from 'react'
import { ConstructSelect } from './components/ConstructSelect'
import { MelodyPlayer } from './components/MelodyPlayer'
import { MelodyTable } from './components/MelodyTable'
import { SignificanceToggle } from './components/SignificanceToggle'
import { TestMode } from './components/TestMode'
import { assetUrl } from './lib/assetUrl'
import { filterFeatureColumns, uniqueConstructs } from './lib/filterColumns'
import type { MelodyDataset } from './types/dataset'
import './App.css'

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
      <main className="app">
        <p className="error" role="alert">
          {error}
        </p>
      </main>
    )
  }

  if (!dataset) {
    return (
      <main className="app">
        <p>Loading MDT fixture dataset…</p>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="header">
        <div className="header-row">
          <h1>MDT analysis dashboard</h1>
          <div className="mode-switch" role="group" aria-label="App mode">
            <button
              type="button"
              className={mode === 'explore' ? 'btn primary' : 'btn'}
              aria-pressed={mode === 'explore'}
              onClick={() => setMode('explore')}
            >
              Explore
            </button>
            <button
              type="button"
              className={mode === 'test' ? 'btn primary' : 'btn'}
              aria-pressed={mode === 'test'}
              disabled={!selectedMelody}
              onClick={() => setMode('test')}
            >
              Test
            </button>
          </div>
        </div>
        <p className="lede">
          {mode === 'explore'
            ? 'Filter feature columns by construct and significance; select a row to inspect playback and piano roll, or open Test mode for a scaffold 3AFC trial.'
            : 'Attempt a scaffold melody item: listen to three alternatives and pick the odd one out.'}
        </p>
      </header>

      {mode === 'test' && selectedMelody ? (
        <TestMode
          melodyId={selectedMelody.id}
          midiPath={selectedMelody.midiPath}
          onExit={() => setMode('explore')}
        />
      ) : (
        <>
          <section className="controls" aria-label="Column filters">
            <ConstructSelect
              constructs={constructOptions}
              selected={constructs}
              onChange={setConstructs}
            />
            <SignificanceToggle
              checked={significantOnly}
              onChange={setSignificantOnly}
            />
            <p className="meta">
              Showing {visibleColumns.length} of {dataset.columns.length} feature
              columns · {dataset.melodies.length} melodies
            </p>
          </section>

          <MelodyTable
            melodies={dataset.melodies}
            columns={visibleColumns}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {selectedMelody ? (
            <>
              <div className="explore-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setMode('test')}
                >
                  Try this item in test mode
                </button>
              </div>
              <MelodyPlayer
                melodyId={selectedMelody.id}
                midiPath={selectedMelody.midiPath}
              />
            </>
          ) : null}
        </>
      )}
    </main>
  )
}

export default App

import { useEffect, useMemo, useRef } from 'react'
import 'wave-roll'
import { assetUrl } from '../lib/assetUrl'

interface MelodyPlayerProps {
  melodyId: string
  midiPath: string
}

export function MelodyPlayer({ melodyId, midiPath }: MelodyPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const filesJson = useMemo(
    () =>
      JSON.stringify([
        {
          path: assetUrl(midiPath),
          name: melodyId,
          type: 'midi',
        },
      ]),
    [melodyId, midiPath],
  )

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    host.replaceChildren()
    const el = document.createElement('wave-roll')
    el.setAttribute('style', 'width: 100%; display: block; min-height: 280px;')
    el.setAttribute('files', filesJson)
    host.appendChild(el)

    return () => {
      host.replaceChildren()
    }
  }, [filesJson])

  return (
    <section className="player" aria-label={`Piano roll for ${melodyId}`}>
      <h2>{melodyId}</h2>
      <div ref={hostRef} />
    </section>
  )
}

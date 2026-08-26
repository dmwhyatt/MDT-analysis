import { useEffect, useRef } from 'react'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.default.css'
import { tomSelectValues } from '../lib/tomSelectValue'

interface ConstructSelectProps {
  constructs: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

// #region agent log
function dbg(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  const payload = { sessionId: 'e1d0', location, message, data, timestamp: Date.now(), hypothesisId }
  fetch('http://127.0.0.1:7243/ingest/3f7e3c2a-0c0e-4e8a-9b1d-5a2f8c4e6d01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e1d0' },
    body: JSON.stringify(payload),
  }).catch(() => {})
  fetch('/__debug_log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}
// #endregion

export function ConstructSelect({ constructs, selected, onChange }: ConstructSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null)
  const tomRef = useRef<TomSelect | null>(null)
  const onChangeRef = useRef(onChange)
  // #region agent log
  const mountIdRef = useRef(Math.random().toString(36).slice(2, 8))
  const changeCountRef = useRef(0)
  // #endregion

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!selectRef.current || tomRef.current) return

    // #region agent log
    dbg('ConstructSelect.tsx:init', 'TomSelect init', {
      mountId: mountIdRef.current,
      hasSelect: !!selectRef.current,
      prevTom: !!tomRef.current,
      constructCount: constructs.length,
    }, 'D')
    // #endregion

    tomRef.current = new TomSelect(selectRef.current, {
      plugins: ['remove_button'],
      maxItems: null,
      placeholder: 'Filter by construct…',
      onChange(value: string | string[]) {
        // Tom Select passes its live `items` array by reference; copy so React
        // state is not mutated in place (which causes setState bailouts).
        const next = tomSelectValues(value)
        // #region agent log
        changeCountRef.current += 1
        dbg('ConstructSelect.tsx:onChange', 'TomSelect config onChange', {
          mountId: mountIdRef.current,
          changeCount: changeCountRef.current,
          value,
          next,
          sameRefAsTom: Array.isArray(value) && next === value,
          tomAlive: !!tomRef.current,
          runId: 'post-fix',
        }, 'A,C')
        // #endregion
        onChangeRef.current(next)
      },
    })

    // #region agent log
    tomRef.current.on('change', (value: string | string[]) => {
      dbg('ConstructSelect.tsx:tom.on(change)', 'TomSelect event listener change', {
        mountId: mountIdRef.current,
        value,
        tomAlive: !!tomRef.current,
      }, 'A,D')
    })
    // #endregion

    return () => {
      // #region agent log
      dbg('ConstructSelect.tsx:destroy', 'TomSelect destroy', {
        mountId: mountIdRef.current,
        hadTom: !!tomRef.current,
      }, 'D')
      // #endregion
      tomRef.current?.destroy()
      tomRef.current = null
    }
  }, [])

  useEffect(() => {
    const tom = tomRef.current
    if (!tom) return
    const currentArr = tomSelectValues(tom.getValue())
    const same =
      currentArr.length === selected.length &&
      currentArr.every((v, i) => v === selected[i])
    // #region agent log
    dbg('ConstructSelect.tsx:sync', 'sync effect', {
      mountId: mountIdRef.current,
      selected,
      currentArr,
      same,
      willSetValue: !same,
      runId: 'post-fix',
    }, 'B')
    // #endregion
    if (!same) {
      tom.setValue(selected, true)
    }
  }, [selected])

  return (
    <label className="control">
      <span className="control-label">Constructs</span>
      <select ref={selectRef} multiple defaultValue={selected}>
        {constructs.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )
}

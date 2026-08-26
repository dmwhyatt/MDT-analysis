import { useEffect, useRef } from 'react'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.default.css'

interface ConstructSelectProps {
  constructs: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function ConstructSelect({ constructs, selected, onChange }: ConstructSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null)
  const tomRef = useRef<TomSelect | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!selectRef.current || tomRef.current) return

    tomRef.current = new TomSelect(selectRef.current, {
      plugins: ['remove_button'],
      maxItems: null,
      placeholder: 'Filter by construct…',
      onChange(value: string | string[]) {
        const next = Array.isArray(value) ? value : value ? [value] : []
        onChangeRef.current(next)
      },
    })

    return () => {
      tomRef.current?.destroy()
      tomRef.current = null
    }
  }, [])

  useEffect(() => {
    const tom = tomRef.current
    if (!tom) return
    const current = tom.getValue()
    const currentArr = Array.isArray(current) ? current : current ? [current] : []
    const same =
      currentArr.length === selected.length &&
      currentArr.every((v, i) => v === selected[i])
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

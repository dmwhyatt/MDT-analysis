import { useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.bootstrap5.css'
import { tomSelectValues } from '../lib/tomSelectValue'

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
        // Tom Select passes its live `items` array by reference; copy so React
        // state is not mutated in place (which causes setState bailouts).
        onChangeRef.current(tomSelectValues(value))
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
    const currentArr = tomSelectValues(tom.getValue())
    const same =
      currentArr.length === selected.length &&
      currentArr.every((v, i) => v === selected[i])
    if (!same) {
      tom.setValue(selected, true)
    }
  }, [selected])

  return (
    <Form.Group controlId="construct-filter">
      <Form.Label className="small text-uppercase fw-semibold text-secondary mb-1">
        Constructs
      </Form.Label>
      <Form.Select ref={selectRef} multiple defaultValue={selected}>
        {constructs.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}

import Form from 'react-bootstrap/Form'

interface SignificanceToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  alpha?: number
}

export function SignificanceToggle({
  checked,
  onChange,
  alpha = 0.05,
}: SignificanceToggleProps) {
  return (
    <Form.Check
      type="checkbox"
      id="significant-only"
      label={`Significant only (p < ${alpha})`}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}

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
    <label className="control checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>Significant only (p &lt; {alpha})</span>
    </label>
  )
}

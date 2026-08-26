/** Copy Tom Select multi values so React state never aliases `tom.items`. */
export function tomSelectValues(value: string | string[]): string[] {
  return Array.isArray(value) ? [...value] : value ? [value] : []
}

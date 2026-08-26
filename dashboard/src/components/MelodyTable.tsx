import { useMemo } from 'react'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { FeatureColumn, MelodyRow } from '../types/dataset'

const features = tableFeatures({})

interface MelodyTableProps {
  melodies: MelodyRow[]
  columns: FeatureColumn[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MelodyTable({
  melodies,
  columns: featureColumns,
  selectedId,
  onSelect,
}: MelodyTableProps) {
  const helper = useMemo(
    () => createColumnHelper<typeof features, MelodyRow>(),
    [],
  )

  const columns = useMemo(
    () =>
      helper.columns([
        helper.accessor('id', {
          header: 'Melody',
          cell: (info) => info.getValue(),
        }),
        ...featureColumns.map((col) =>
          helper.accessor((row) => row.features[col.id], {
            id: col.id,
            header: col.label,
            cell: (info) => {
              const value = info.getValue()
              return typeof value === 'number' ? value.toFixed(2) : '—'
            },
          }),
        ),
      ]),
    [helper, featureColumns],
  )

  const table = useTable({
    features,
    columns,
    data: melodies,
  })

  return (
    <div className="table-wrap">
      <table className="melody-table">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const id = row.original.id
            return (
              <tr
                key={row.id}
                className={id === selectedId ? 'selected' : undefined}
                onClick={() => onSelect(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(id)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={id === selectedId}
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {melodies.length === 0 ? (
        <p className="empty">No melodies match the current filters.</p>
      ) : null}
    </div>
  )
}

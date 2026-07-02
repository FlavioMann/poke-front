import { useQuery } from '@tanstack/react-query'
import { getAllGenerations } from '@/services/pokeapi'
import { HEIGHT_BOUNDS, WEIGHT_BOUNDS, formatGeneration, idFromUrl } from '@/lib/pokemon'
import type { FilterState } from '@/store/useAppStore'

interface FilterPanelProps {
  filters: FilterState
  onSetGeneration: (generation: number | null) => void
  onSetHeightRange: (range: [number, number] | null) => void
  onSetWeightRange: (range: [number, number] | null) => void
  onReset: () => void
  open: boolean
  onClose: () => void
}

export function FilterPanel({
  filters,
  onSetGeneration,
  onSetHeightRange,
  onSetWeightRange,
  onReset,
  open,
  onClose,
}: FilterPanelProps) {
  const generationsQuery = useQuery({
    queryKey: ['generations-list'],
    queryFn: getAllGenerations,
    staleTime: Infinity,
  })

  const activeCount =
    (filters.generation != null ? 1 : 0) +
    (filters.heightRange ? 1 : 0) +
    (filters.weightRange ? 1 : 0)

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Fechar filtros"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30"
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-800">
            Mais filtros {activeCount > 0 && <span className="text-brand-500">({activeCount})</span>}
          </h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onReset} className="text-xs font-semibold text-brand-500 hover:underline">
              Limpar
            </button>
            <button type="button" onClick={onClose} className="text-neutral-400" aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-neutral-600">Geração</h3>
          <select
            value={filters.generation ?? ''}
            onChange={(event) =>
              onSetGeneration(event.target.value === '' ? null : Number(event.target.value))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {generationsQuery.data?.results.map((gen) => (
              <option key={gen.name} value={idFromUrl(gen.url)}>
                {formatGeneration(gen.name)}
              </option>
            ))}
          </select>
        </section>

        <RangeFilter
          label="Altura (m)"
          bounds={HEIGHT_BOUNDS}
          value={filters.heightRange}
          onChange={onSetHeightRange}
          step={0.1}
        />

        <RangeFilter
          label="Peso (kg)"
          bounds={WEIGHT_BOUNDS}
          value={filters.weightRange}
          onChange={onSetWeightRange}
          step={1}
        />
      </aside>
    </>
  )
}

interface RangeFilterProps {
  label: string
  bounds: [number, number]
  value: [number, number] | null
  onChange: (range: [number, number] | null) => void
  step: number
}

function RangeFilter({ label, bounds, value, onChange, step }: RangeFilterProps) {
  const [min, max] = value ?? bounds

  function update(nextMin: number, nextMax: number) {
    if (nextMin <= bounds[0] && nextMax >= bounds[1]) {
      onChange(null)
    } else {
      onChange([nextMin, nextMax])
    }
  }

  return (
    <section className="mb-6">
      <h3 className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-600">
        <span>{label}</span>
        <span className="font-normal text-neutral-400">
          {min} – {max}
        </span>
      </h3>
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={bounds[0]}
          max={bounds[1]}
          step={step}
          value={min}
          onChange={(event) => update(Math.min(Number(event.target.value), max), max)}
          aria-label={`${label} mínimo`}
          className="w-full accent-brand-500"
        />
        <input
          type="range"
          min={bounds[0]}
          max={bounds[1]}
          step={step}
          value={max}
          onChange={(event) => update(min, Math.max(Number(event.target.value), min))}
          aria-label={`${label} máximo`}
          className="w-full accent-brand-500"
        />
      </div>
    </section>
  )
}

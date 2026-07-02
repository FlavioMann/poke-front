import { useState } from 'react'
import { usePokemonExplorer } from '@/hooks/usePokemonExplorer'
import { useAppStore } from '@/store/useAppStore'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { TypeSheet } from '@/components/TypeSheet'
import { PokemonGrid } from '@/components/PokemonGrid'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { TYPE_LABELS_PT } from '@/lib/pokemon'

export function HomePage() {
  const filters = useAppStore((state) => state.filters)
  const setSearch = useAppStore((state) => state.setSearch)
  const toggleType = useAppStore((state) => state.toggleType)
  const setGeneration = useAppStore((state) => state.setGeneration)
  const setHeightRange = useAppStore((state) => state.setHeightRange)
  const setWeightRange = useAppStore((state) => state.setWeightRange)
  const setSort = useAppStore((state) => state.setSort)
  const resetFilters = useAppStore((state) => state.resetFilters)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [typeSheetOpen, setTypeSheetOpen] = useState(false)

  const { pokemon, isLoadingCandidates, isLoadingDetails, hasMore, loadMore, totalCandidates } =
    usePokemonExplorer(filters)

  const typeLabel =
    filters.types.length === 0
      ? 'Todos os tipos'
      : filters.types.length === 1
        ? TYPE_LABELS_PT[filters.types[0]!]
        : `${filters.types.length} tipos`

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3">
        <SearchBar value={filters.search} onChange={setSearch} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTypeSheetOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {typeLabel}
          <ChevronDownIcon />
        </button>

        <div className="relative">
          <select
            value={filters.sort}
            onChange={(event) => setSort(event.target.value as 'asc' | 'desc')}
            aria-label="Ordenar"
            className="appearance-none rounded-full bg-neutral-900 py-2 pl-4 pr-8 text-sm font-semibold text-white"
          >
            <option value="asc">Menor número</option>
            <option value="desc">Maior número</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700"
        >
          Mais filtros
        </button>
      </div>

      <FilterPanel
        filters={filters}
        onSetGeneration={setGeneration}
        onSetHeightRange={setHeightRange}
        onSetWeightRange={setWeightRange}
        onReset={resetFilters}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <TypeSheet
        open={typeSheetOpen}
        selected={filters.types}
        onToggle={toggleType}
        onClear={() => filters.types.forEach((t) => toggleType(t))}
        onClose={() => setTypeSheetOpen(false)}
      />

      {!isLoadingCandidates && (
        <p className="mb-3 text-sm text-neutral-500">
          {totalCandidates} pokémon encontrado{totalCandidates === 1 ? '' : 's'}
        </p>
      )}

      <PokemonGrid
        pokemon={pokemon}
        skeletonCount={isLoadingCandidates || isLoadingDetails ? 8 : 0}
        emptyMessage="Nenhum pokémon corresponde aos filtros selecionados."
      />

      {!isLoadingCandidates && hasMore && <LoadMoreButton onClick={loadMore} loading={isLoadingDetails} />}
    </div>
  )
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 fill-none stroke-current ${className}`} strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  )
}

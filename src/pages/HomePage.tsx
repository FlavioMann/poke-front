import { useState } from 'react'
import { usePokemonExplorer } from '@/hooks/usePokemonExplorer'
import { useAppStore } from '@/store/useAppStore'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { PokemonGrid } from '@/components/PokemonGrid'
import { LoadMoreButton } from '@/components/LoadMoreButton'

export function HomePage() {
  const filters = useAppStore((state) => state.filters)
  const setSearch = useAppStore((state) => state.setSearch)
  const toggleType = useAppStore((state) => state.toggleType)
  const setGeneration = useAppStore((state) => state.setGeneration)
  const setHeightRange = useAppStore((state) => state.setHeightRange)
  const setWeightRange = useAppStore((state) => state.setWeightRange)
  const resetFilters = useAppStore((state) => state.resetFilters)

  const [filtersOpen, setFiltersOpen] = useState(false)

  const { pokemon, isLoadingCandidates, isLoadingDetails, hasMore, loadMore, totalCandidates } =
    usePokemonExplorer(filters)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={filters.search} onChange={setSearch} />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm md:hidden"
        >
          Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <FilterPanel
          filters={filters}
          onToggleType={toggleType}
          onSetGeneration={setGeneration}
          onSetHeightRange={setHeightRange}
          onSetWeightRange={setWeightRange}
          onReset={resetFilters}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <div>
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

          {!isLoadingCandidates && hasMore && (
            <LoadMoreButton onClick={loadMore} loading={isLoadingDetails} />
          )}
        </div>
      </div>
    </div>
  )
}

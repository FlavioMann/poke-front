import { useEffect, useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import {
  getAllPokemon,
  getPokemonByGeneration,
  getPokemonByType,
  getPokemonDetail,
} from '@/services/pokeapi'
import { heightToMeters, weightToKilograms } from '@/lib/pokemon'
import type { PokemonDetail } from '@/types/pokeapi'
import type { FilterState } from '@/store/useAppStore'

const PAGE_SIZE = 20

// Height/weight filters run client-side on the fetched details below,
// since PokeAPI's list endpoints don't expose those fields.
export function usePokemonExplorer(filters: FilterState) {
  const indexQuery = useQuery({
    queryKey: ['pokemon-index'],
    queryFn: getAllPokemon,
    staleTime: Infinity,
  })

  const typeQueries = useQueries({
    queries: filters.types.map((type) => ({
      queryKey: ['pokemon-type', type],
      queryFn: () => getPokemonByType(type),
      staleTime: Infinity,
    })),
  })

  const generationQuery = useQuery({
    queryKey: ['pokemon-generation', filters.generation],
    queryFn: () => getPokemonByGeneration(filters.generation as number),
    enabled: filters.generation != null,
    staleTime: Infinity,
  })

  const isLoadingCandidates =
    indexQuery.isLoading ||
    (filters.types.length > 0 && typeQueries.some((q) => q.isLoading)) ||
    (filters.generation != null && generationQuery.isLoading)

  const candidateNames = useMemo(() => {
    if (!indexQuery.data) return []
    let names = indexQuery.data.results.map((r) => r.name)

    const query = filters.search.trim().toLowerCase()
    if (query) {
      names = names.filter((name) => name.includes(query))
    }

    if (filters.types.length > 0) {
      if (typeQueries.some((q) => !q.data)) return []
      const union = new Set<string>()
      for (const typeQuery of typeQueries) {
        for (const entry of typeQuery.data?.pokemon ?? []) {
          union.add(entry.pokemon.name)
        }
      }
      names = names.filter((name) => union.has(name))
    }

    if (filters.generation != null) {
      if (!generationQuery.data) return []
      const genSet = new Set(
        generationQuery.data.pokemon_species.map((s) => s.name),
      )
      names = names.filter((name) => genSet.has(name))
    }

    // getAllPokemon already returns results in ascending id order.
    return filters.sort === 'desc' ? names.toReversed() : names
  }, [
    indexQuery.data,
    filters.search,
    filters.types,
    filters.generation,
    filters.sort,
    typeQueries,
    generationQuery.data,
  ])

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters.search, filters.types.join(','), filters.generation, filters.sort])

  const visibleNames = candidateNames.slice(0, visibleCount)

  const detailQueries = useQueries({
    queries: visibleNames.map((name) => ({
      queryKey: ['pokemon-detail', name],
      queryFn: () => getPokemonDetail(name),
      staleTime: Infinity,
    })),
  })

  const isLoadingDetails = detailQueries.some((q) => q.isLoading)

  const details = useMemo(
    () =>
      detailQueries
        .map((q) => q.data)
        .filter((d): d is PokemonDetail => d != null),
    [detailQueries],
  )

  const pokemon = useMemo(() => {
    return details.filter((detail) => {
      if (filters.heightRange) {
        const h = heightToMeters(detail.height)
        if (h < filters.heightRange[0] || h > filters.heightRange[1]) return false
      }
      if (filters.weightRange) {
        const w = weightToKilograms(detail.weight)
        if (w < filters.weightRange[0] || w > filters.weightRange[1]) return false
      }
      return true
    })
  }, [details, filters.heightRange, filters.weightRange])

  return {
    pokemon,
    isLoadingCandidates,
    isLoadingDetails,
    hasMore: visibleCount < candidateNames.length,
    loadMore: () => setVisibleCount((c) => c + PAGE_SIZE),
    totalCandidates: candidateNames.length,
  }
}

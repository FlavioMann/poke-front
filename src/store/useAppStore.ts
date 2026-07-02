import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PokemonType } from '@/types/pokeapi'

export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  search: string
  types: PokemonType[]
  generation: number | null
  heightRange: [number, number] | null
  weightRange: [number, number] | null
  sort: SortOrder
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  types: [],
  generation: null,
  heightRange: null,
  weightRange: null,
  sort: 'asc',
}

interface AppState {
  favorites: Record<string, true>
  filters: FilterState
  toggleFavorite: (name: string) => void
  isFavorite: (name: string) => boolean
  setSearch: (search: string) => void
  toggleType: (type: PokemonType) => void
  setGeneration: (generation: number | null) => void
  setHeightRange: (range: [number, number] | null) => void
  setWeightRange: (range: [number, number] | null) => void
  setSort: (sort: SortOrder) => void
  resetAdvancedFilters: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: {},
      filters: DEFAULT_FILTERS,

      toggleFavorite: (name) =>
        set((state) => {
          const next = { ...state.favorites }
          if (next[name]) {
            delete next[name]
          } else {
            next[name] = true
          }
          return { favorites: next }
        }),

      isFavorite: (name) => Boolean(get().favorites[name]),

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),

      toggleType: (type) =>
        set((state) => {
          const types = state.filters.types.includes(type)
            ? state.filters.types.filter((t) => t !== type)
            : [...state.filters.types, type]
          return { filters: { ...state.filters, types } }
        }),

      setGeneration: (generation) =>
        set((state) => ({ filters: { ...state.filters, generation } })),

      setHeightRange: (heightRange) =>
        set((state) => ({ filters: { ...state.filters, heightRange } })),

      setWeightRange: (weightRange) =>
        set((state) => ({ filters: { ...state.filters, weightRange } })),

      setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),

      resetAdvancedFilters: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            generation: DEFAULT_FILTERS.generation,
            heightRange: DEFAULT_FILTERS.heightRange,
            weightRange: DEFAULT_FILTERS.weightRange,
          },
        })),
    }),
    {
      name: 'poke-front:store',
    },
  ),
)

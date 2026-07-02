import { Link } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { getPokemonDetail } from '@/services/pokeapi'
import { PokemonGrid } from '@/components/PokemonGrid'
import type { PokemonDetail } from '@/types/pokeapi'

export function FavoritesPage() {
  const favorites = useAppStore((state) => state.favorites)
  const names = Object.keys(favorites)

  const queries = useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon-detail', name],
      queryFn: () => getPokemonDetail(name),
      staleTime: Infinity,
    })),
  })

  const pokemon = queries
    .map((q) => q.data)
    .filter((d): d is PokemonDetail => d != null)
    .sort((a, b) => a.id - b.id)

  const isLoading = queries.some((q) => q.isLoading)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-neutral-800">Seus favoritos</h1>
      <p className="mb-6 text-sm text-neutral-500">
        {names.length} pokémon favoritado{names.length === 1 ? '' : 's'} — salvos neste navegador.
      </p>

      {names.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span aria-hidden="true" className="mb-4 text-6xl grayscale opacity-40">
            🐟
          </span>
          <p className="font-semibold text-neutral-700">Você não favoritou nenhum Pokémon :(</p>
          <p className="mt-1 max-w-xs text-sm text-neutral-500">
            Clique no ícone de coração dos seus pokémons favoritos e eles aparecerão aqui.
          </p>
          <Link to="/" className="mt-4 font-semibold text-brand-500 underline">
            Explorar pokédex
          </Link>
        </div>
      ) : (
        <PokemonGrid pokemon={pokemon} skeletonCount={isLoading ? names.length - pokemon.length : 0} />
      )}
    </div>
  )
}

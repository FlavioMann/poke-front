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
        <p className="py-16 text-center text-neutral-500">
          Você ainda não favoritou nenhum pokémon.{' '}
          <Link to="/" className="font-semibold text-brand-500 underline">
            Explorar pokédex
          </Link>
        </p>
      ) : (
        <PokemonGrid pokemon={pokemon} skeletonCount={isLoading ? names.length - pokemon.length : 0} />
      )}
    </div>
  )
}

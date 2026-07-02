import { PokemonCard } from '@/components/PokemonCard'
import { PokemonCardSkeleton } from '@/components/PokemonCardSkeleton'
import type { PokemonDetail } from '@/types/pokeapi'

interface PokemonGridProps {
  pokemon: PokemonDetail[]
  emptyMessage?: string
  skeletonCount?: number
}

export function PokemonGrid({
  pokemon,
  emptyMessage = 'Nenhum pokémon encontrado.',
  skeletonCount = 0,
}: PokemonGridProps) {
  if (pokemon.length === 0 && skeletonCount === 0) {
    return (
      <p className="py-16 text-center text-neutral-500">{emptyMessage}</p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <PokemonCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  )
}

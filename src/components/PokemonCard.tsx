import { Link } from 'react-router-dom'
import { TypeBadge } from '@/components/TypeBadge'
import { FavoriteButton } from '@/components/FavoriteButton'
import { bestSprite, formatPokemonName } from '@/lib/pokemon'
import type { PokemonDetail } from '@/types/pokeapi'

interface PokemonCardProps {
  pokemon: PokemonDetail
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const sprite = bestSprite(pokemon.sprites)

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <FavoriteButton name={pokemon.name} className="absolute right-2 top-2" />
      <span className="self-start text-xs font-semibold text-neutral-400">
        #{String(pokemon.id).padStart(3, '0')}
      </span>
      {sprite ? (
        <img
          src={sprite}
          alt={pokemon.name}
          loading="lazy"
          className="h-24 w-24 object-contain transition group-hover:scale-110 sm:h-28 sm:w-28"
        />
      ) : (
        <div className="h-24 w-24 sm:h-28 sm:w-28" />
      )}
      <h3 className="mt-1 font-semibold text-neutral-800">
        {formatPokemonName(pokemon.name)}
      </h3>
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {pokemon.types.map((slot) => (
          <TypeBadge key={slot.type.name} type={slot.type.name} />
        ))}
      </div>
    </Link>
  )
}

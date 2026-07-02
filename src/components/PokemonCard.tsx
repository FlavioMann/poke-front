import { Link } from 'react-router-dom'
import { TypeBadge } from '@/components/TypeBadge'
import { FavoriteButton } from '@/components/FavoriteButton'
import { TYPE_COLORS, TYPE_TINTS, bestSprite, formatPokemonName } from '@/lib/pokemon'
import type { PokemonDetail, PokemonType } from '@/types/pokeapi'

interface PokemonCardProps {
  pokemon: PokemonDetail
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const sprite = bestSprite(pokemon.sprites)
  const primaryType = pokemon.types[0]?.type.name as PokemonType | undefined
  const tint = primaryType ? TYPE_TINTS[primaryType] : 'bg-neutral-100'
  const solid = primaryType ? TYPE_COLORS[primaryType] : 'bg-neutral-300'

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className={`flex items-center gap-3 rounded-2xl p-3 transition hover:-translate-y-0.5 hover:shadow-md ${tint}`}
    >
      <div className="min-w-0 flex-1 py-1">
        <span className="text-xs font-semibold text-neutral-500">
          Nº{String(pokemon.id).padStart(3, '0')}
        </span>
        <h3 className="truncate text-lg font-bold text-neutral-800">
          {formatPokemonName(pokemon.name)}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {pokemon.types.map((slot) => (
            <TypeBadge key={slot.type.name} type={slot.type.name} />
          ))}
        </div>
      </div>

      <div className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl ${solid}`}>
        <FavoriteButton name={pokemon.name} size="xs" className="absolute right-1 top-1" />
        {sprite ? (
          <img
            src={sprite}
            alt={pokemon.name}
            loading="lazy"
            className="h-16 w-16 object-contain drop-shadow"
          />
        ) : null}
      </div>
    </Link>
  )
}

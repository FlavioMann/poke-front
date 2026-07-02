import { TYPE_COLORS, formatPokemonName } from '@/lib/pokemon'
import type { PokemonType } from '@/types/pokeapi'

interface TypeBadgeProps {
  type: PokemonType | string
  className?: string
}

export function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const colorClass = TYPE_COLORS[type as PokemonType] ?? 'bg-neutral-400'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ${colorClass} ${className}`}
    >
      {formatPokemonName(type)}
    </span>
  )
}

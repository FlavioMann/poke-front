import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS_PT, formatPokemonName } from '@/lib/pokemon'
import type { PokemonType } from '@/types/pokeapi'

interface TypeBadgeProps {
  type: PokemonType | string
  className?: string
}

export function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const known = type in TYPE_COLORS
  const colorClass = known ? TYPE_COLORS[type as PokemonType] : 'bg-neutral-400'
  const label = known ? TYPE_LABELS_PT[type as PokemonType] : formatPokemonName(type)
  const icon = known ? TYPE_ICONS[type as PokemonType] : null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ${colorClass} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  )
}

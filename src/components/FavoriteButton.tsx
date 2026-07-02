import { useAppStore } from '@/store/useAppStore'

interface FavoriteButtonProps {
  name: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = { xs: 'h-7 w-7', sm: 'h-8 w-8', md: 'h-11 w-11' } as const

export function FavoriteButton({ name, size = 'sm', className = '' }: FavoriteButtonProps) {
  const isFavorite = useAppStore((state) => Boolean(state.favorites[name]))
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

  const dimension = SIZE_CLASSES[size]

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remover ${name} dos favoritos` : `Favoritar ${name}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(name)
      }}
      className={`flex ${dimension} items-center justify-center rounded-full bg-white/80 shadow transition hover:scale-110 hover:bg-white ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-1/2 w-1/2 ${isFavorite ? 'fill-brand-500 stroke-brand-500' : 'fill-none stroke-neutral-500'}`}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-6.716-4.35-9.428-8.06C.6 10.24 1.04 6.5 4.05 4.99c2.29-1.15 4.86-.4 6.24 1.4l1.71 2.24 1.71-2.24c1.38-1.8 3.95-2.55 6.24-1.4 3.01 1.51 3.45 5.25 1.48 7.95C18.716 16.65 12 21 12 21z"
        />
      </svg>
    </button>
  )
}

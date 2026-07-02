import { POKEMON_TYPES } from '@/types/pokeapi'
import type { PokemonType } from '@/types/pokeapi'
import { TYPE_COLORS, TYPE_LABELS_PT } from '@/lib/pokemon'

interface TypeSheetProps {
  open: boolean
  selected: PokemonType[]
  onToggle: (type: PokemonType) => void
  onClear: () => void
  onClose: () => void
}

export function TypeSheet({ open, selected, onToggle, onClear, onClose }: TypeSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Fechar seleção de tipo"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-sm sm:rounded-3xl">
        <h2 className="mb-4 text-center text-base font-bold text-neutral-800">Selecione o tipo</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClear()
              onClose()
            }}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${
              selected.length === 0 ? 'bg-neutral-900' : 'bg-neutral-400'
            }`}
          >
            Todos os tipos
          </button>
          {POKEMON_TYPES.map((type) => {
            const isSelected = selected.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggle(type)}
                aria-pressed={isSelected}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${TYPE_COLORS[type]} ${
                  isSelected ? 'ring-2 ring-offset-2 ring-neutral-900' : 'opacity-80'
                }`}
              >
                {TYPE_LABELS_PT[type]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

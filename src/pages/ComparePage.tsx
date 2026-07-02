import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllPokemon, getPokemonDetail } from '@/services/pokeapi'
import { bestSprite, formatPokemonName, heightToMeters, weightToKilograms, STAT_LABELS } from '@/lib/pokemon'
import { TypeBadge } from '@/components/TypeBadge'
import { StatBar } from '@/components/StatBar'
import type { PokemonDetail } from '@/types/pokeapi'

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const a = searchParams.get('a')
  const b = searchParams.get('b')

  const indexQuery = useQuery({ queryKey: ['pokemon-index'], queryFn: getAllPokemon, staleTime: Infinity })
  const allNames = indexQuery.data?.results.map((r) => r.name) ?? []

  const detailA = useQuery({
    queryKey: ['pokemon-detail', a],
    queryFn: () => getPokemonDetail(a as string),
    enabled: Boolean(a),
    staleTime: Infinity,
  })
  const detailB = useQuery({
    queryKey: ['pokemon-detail', b],
    queryFn: () => getPokemonDetail(b as string),
    enabled: Boolean(b),
    staleTime: Infinity,
  })

  function updateParam(key: 'a' | 'b', name: string | null) {
    const next = new URLSearchParams(searchParams)
    if (name) next.set(key, name)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-neutral-800">Comparar pokémons</h1>
      <p className="mb-6 text-sm text-neutral-500">Escolha dois pokémons para comparar as estatísticas base.</p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PokemonPicker label="Pokémon A" value={a} allNames={allNames} onChange={(name) => updateParam('a', name)} />
        <PokemonPicker label="Pokémon B" value={b} allNames={allNames} onChange={(name) => updateParam('b', name)} />
      </div>

      {detailA.data && detailB.data ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ComparisonColumn pokemon={detailA.data} opponent={detailB.data} />
          <ComparisonColumn pokemon={detailB.data} opponent={detailA.data} />
        </div>
      ) : (
        <p className="py-16 text-center text-neutral-400">
          {a && b ? 'Carregando...' : 'Selecione dois pokémons acima para ver a comparação.'}
        </p>
      )}
    </div>
  )
}

function ComparisonColumn({ pokemon, opponent }: { pokemon: PokemonDetail; opponent: PokemonDetail }) {
  const sprite = bestSprite(pokemon.sprites)
  const opponentStat = (statName: string) => opponent.stats.find((s) => s.stat.name === statName)?.base_stat

  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)
  const opponentTotal = opponent.stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {sprite && <img src={sprite} alt={pokemon.name} className="h-28 w-28 object-contain" />}
        <h2 className="text-lg font-bold text-neutral-800">{formatPokemonName(pokemon.name)}</h2>
        <div className="mt-1 flex gap-1.5">
          {pokemon.types.map((slot) => (
            <TypeBadge key={slot.type.name} type={slot.type.name} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-around text-center text-sm">
        <StatComparisonValue
          label="Altura"
          value={`${heightToMeters(pokemon.height)} m`}
          higher={pokemon.height > opponent.height}
          lower={pokemon.height < opponent.height}
        />
        <StatComparisonValue
          label="Peso"
          value={`${weightToKilograms(pokemon.weight)} kg`}
          higher={pokemon.weight > opponent.weight}
          lower={pokemon.weight < opponent.weight}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {pokemon.stats.map((s) => (
          <StatBar
            key={s.stat.name}
            label={STAT_LABELS[s.stat.name] ?? s.stat.name}
            value={s.base_stat}
            compareValue={opponentStat(s.stat.name)}
          />
        ))}
        <div className="mt-1 border-t border-neutral-100 pt-2">
          <StatBar label="Total" value={total} compareValue={opponentTotal} colorClass="bg-neutral-700" />
        </div>
      </div>
    </div>
  )
}

function StatComparisonValue({
  label,
  value,
  higher,
  lower,
}: {
  label: string
  value: string
  higher: boolean
  lower: boolean
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</div>
      <div className={`font-semibold ${higher ? 'text-green-600' : lower ? 'text-red-500' : 'text-neutral-700'}`}>
        {value}
      </div>
    </div>
  )
}

function PokemonPicker({
  label,
  value,
  allNames,
  onChange,
}: {
  label: string
  value: string | null
  allNames: string[]
  onChange: (name: string | null) => void
}) {
  const [query, setQuery] = useState(value ?? '')

  useEffect(() => {
    setQuery(value ?? '')
  }, [value])

  const trimmed = query.trim().toLowerCase()
  const showSuggestions = trimmed.length > 0 && trimmed !== value
  const matches = showSuggestions ? allNames.filter((n) => n.includes(trimmed)).slice(0, 8) : []

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-semibold text-neutral-600">{label}</label>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          if (event.target.value === '') onChange(null)
        }}
        placeholder="Digite o nome..."
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {matches.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {matches.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => onChange(name)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
              >
                {formatPokemonName(name)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

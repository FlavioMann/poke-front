import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEvolutionChain, getPokemonDetail, getPokemonSpecies } from '@/services/pokeapi'
import {
  bestSprite,
  formatGeneration,
  formatPokemonName,
  heightToMeters,
  weightToKilograms,
} from '@/lib/pokemon'
import { STAT_LABELS } from '@/lib/pokemon'
import { TypeBadge } from '@/components/TypeBadge'
import { FavoriteButton } from '@/components/FavoriteButton'
import { StatBar } from '@/components/StatBar'
import { EvolutionChain } from '@/components/EvolutionChain'

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()

  const detailQuery = useQuery({
    queryKey: ['pokemon-detail', name],
    queryFn: () => getPokemonDetail(name as string),
    enabled: Boolean(name),
    staleTime: Infinity,
  })

  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', name],
    queryFn: () => getPokemonSpecies(name as string),
    enabled: Boolean(name),
    staleTime: Infinity,
  })

  const evolutionQuery = useQuery({
    queryKey: ['evolution-chain', speciesQuery.data?.evolution_chain.url],
    queryFn: () => getEvolutionChain(speciesQuery.data!.evolution_chain.url),
    enabled: Boolean(speciesQuery.data),
    staleTime: Infinity,
  })

  if (detailQuery.isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-neutral-500">Carregando...</div>
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-neutral-500">
        Não foi possível carregar este pokémon.{' '}
        <Link to="/" className="text-brand-500 underline">
          Voltar
        </Link>
      </div>
    )
  }

  const pokemon = detailQuery.data
  const sprite = bestSprite(pokemon.sprites)
  const flavorText =
    speciesQuery.data?.flavor_text_entries.find((e) => e.language.name === 'pt-BR' || e.language.name === 'pt')
      ?.flavor_text ?? speciesQuery.data?.flavor_text_entries.find((e) => e.language.name === 'en')?.flavor_text

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-brand-500">
        ← Voltar
      </Link>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="relative flex flex-col items-center bg-gradient-to-b from-brand-50 to-white p-6">
          <FavoriteButton name={pokemon.name} size="md" className="absolute right-4 top-4" />
          <span className="text-sm font-semibold text-neutral-400">#{String(pokemon.id).padStart(3, '0')}</span>
          {sprite && <img src={sprite} alt={pokemon.name} className="h-40 w-40 object-contain sm:h-52 sm:w-52" />}
          <h1 className="mt-1 text-2xl font-bold text-neutral-800">{formatPokemonName(pokemon.name)}</h1>
          <div className="mt-2 flex gap-2">
            {pokemon.types.map((slot) => (
              <TypeBadge key={slot.type.name} type={slot.type.name} />
            ))}
          </div>
          {flavorText && (
            <p className="mt-4 max-w-md text-center text-sm text-neutral-500">
              {flavorText.replace(/\f|\n/g, ' ')}
            </p>
          )}
          <Link
            to={`/comparar?a=${pokemon.name}`}
            className="mt-4 rounded-full border border-brand-500 px-4 py-1.5 text-sm font-semibold text-brand-500 hover:bg-brand-50"
          >
            Comparar este pokémon
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 p-6 sm:grid-cols-4">
          <Info label="Altura" value={`${heightToMeters(pokemon.height)} m`} />
          <Info label="Peso" value={`${weightToKilograms(pokemon.weight)} kg`} />
          <Info label="Geração" value={speciesQuery.data ? formatGeneration(speciesQuery.data.generation.name) : '—'} />
          <Info
            label="Habilidades"
            value={pokemon.abilities.map((a) => formatPokemonName(a.ability.name)).join(', ')}
          />
        </div>

        <div className="border-t border-neutral-100 p-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Estatísticas base</h2>
          <div className="flex flex-col gap-2">
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} label={STAT_LABELS[s.stat.name] ?? s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 p-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Cadeia de evolução</h2>
          {evolutionQuery.data ? (
            <EvolutionChain chain={evolutionQuery.data.chain} />
          ) : (
            <p className="text-sm text-neutral-400">Carregando...</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="text-sm font-medium text-neutral-800">{value}</div>
    </div>
  )
}

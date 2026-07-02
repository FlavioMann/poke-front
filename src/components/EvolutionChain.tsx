import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPokemonDetail } from '@/services/pokeapi'
import { bestSprite, flattenEvolutionChain, formatPokemonName } from '@/lib/pokemon'
import type { EvolutionChainLink, PokemonDetail } from '@/types/pokeapi'

interface EvolutionChainProps {
  chain: EvolutionChainLink
}

export function EvolutionChain({ chain }: EvolutionChainProps) {
  const names = flattenEvolutionChain(chain)

  const queries = useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon-detail', name],
      queryFn: () => getPokemonDetail(name),
      staleTime: Infinity,
    })),
  })

  const detailsByName = new Map<string, PokemonDetail>()
  queries.forEach((q, i) => {
    if (q.data) detailsByName.set(names[i]!, q.data)
  })

  if (names.length <= 1) {
    return <p className="text-sm text-neutral-500">Este pokémon não evolui.</p>
  }

  return (
    <div className="overflow-x-auto">
      <EvolutionNode link={chain} detailsByName={detailsByName} />
    </div>
  )
}

function EvolutionNode({
  link,
  detailsByName,
}: {
  link: EvolutionChainLink
  detailsByName: Map<string, PokemonDetail>
}) {
  const detail = detailsByName.get(link.species.name)

  return (
    <div className="flex items-center gap-3">
      <EvolutionCard name={link.species.name} detail={detail} />
      {link.evolves_to.length > 0 && (
        <>
          <span aria-hidden="true" className="shrink-0 text-2xl text-neutral-300">
            →
          </span>
          <div className="flex flex-col gap-4">
            {link.evolves_to.map((child) => (
              <EvolutionNode key={child.species.name} link={child} detailsByName={detailsByName} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EvolutionCard({ name, detail }: { name: string; detail: PokemonDetail | undefined }) {
  const sprite = detail ? bestSprite(detail.sprites) : null

  return (
    <Link
      to={`/pokemon/${name}`}
      className="flex w-24 shrink-0 flex-col items-center rounded-xl border border-neutral-200 bg-white p-2 text-center transition hover:-translate-y-0.5 hover:shadow"
    >
      {sprite ? (
        <img src={sprite} alt={name} className="h-16 w-16 object-contain" />
      ) : (
        <div className="h-16 w-16 animate-pulse rounded-full bg-neutral-100" />
      )}
      <span className="mt-1 text-xs font-semibold text-neutral-700">{formatPokemonName(name)}</span>
    </Link>
  )
}

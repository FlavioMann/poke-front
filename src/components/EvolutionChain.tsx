import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPokemonDetail } from '@/services/pokeapi'
import { TYPE_TINTS, bestSprite, describeEvolution, flattenEvolutionChain, formatPokemonName } from '@/lib/pokemon'
import type { EvolutionChainLink, PokemonDetail, PokemonType } from '@/types/pokeapi'

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

  return <EvolutionNode link={chain} detailsByName={detailsByName} />
}

function EvolutionNode({
  link,
  detailsByName,
}: {
  link: EvolutionChainLink
  detailsByName: Map<string, PokemonDetail>
}) {
  return (
    <div>
      <EvolutionRow name={link.species.name} detail={detailsByName.get(link.species.name)} />
      {link.evolves_to.map((child) => (
        <div key={child.species.name} className="ml-6 border-l-2 border-neutral-100 pl-4">
          <span className="block py-1 text-xs font-semibold text-neutral-400">
            ↓ {describeEvolution(child.evolution_details)}
          </span>
          <EvolutionNode link={child} detailsByName={detailsByName} />
        </div>
      ))}
    </div>
  )
}

function EvolutionRow({ name, detail }: { name: string; detail: PokemonDetail | undefined }) {
  const sprite = detail ? bestSprite(detail.sprites) : null
  const primaryType = detail?.types[0]?.type.name as PokemonType | undefined
  const tint = primaryType ? TYPE_TINTS[primaryType] : 'bg-neutral-100'

  return (
    <Link to={`/pokemon/${name}`} className="flex items-center gap-3 rounded-xl py-1.5 transition hover:bg-neutral-50">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}>
        {sprite ? (
          <img src={sprite} alt={name} className="h-11 w-11 object-contain" />
        ) : (
          <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-200" />
        )}
      </div>
      <div>
        <div className="font-semibold text-neutral-800">{formatPokemonName(name)}</div>
        {detail && (
          <div className="text-xs font-semibold text-neutral-400">
            Nº{String(detail.id).padStart(3, '0')}
          </div>
        )}
      </div>
    </Link>
  )
}

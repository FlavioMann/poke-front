import type { EvolutionChainLink, EvolutionDetail, PokemonType, TypeResponse } from '@/types/pokeapi'

/** Extracts the numeric id from a PokeAPI resource url, e.g. `.../pokemon/25/` -> 25 */
export function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url)
  if (!match?.[1]) {
    throw new Error(`Could not extract id from url: ${url}`)
  }
  return Number(match[1])
}

export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0]!.toUpperCase() + value.slice(1)
}

export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ')
}

/** PokeAPI height is in decimetres; convert to metres. */
export function heightToMeters(height: number): number {
  return height / 10
}

/** PokeAPI weight is in hectograms; convert to kilograms. */
export function weightToKilograms(weight: number): number {
  return weight / 10
}

/** Generous bounds covering (almost) every pokémon, used as slider limits. */
export const HEIGHT_BOUNDS: [number, number] = [0, 20]
export const WEIGHT_BOUNDS: [number, number] = [0, 1000]

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-poke-normal',
  fire: 'bg-poke-fire',
  water: 'bg-poke-water',
  electric: 'bg-poke-electric',
  grass: 'bg-poke-grass',
  ice: 'bg-poke-ice',
  fighting: 'bg-poke-fighting',
  poison: 'bg-poke-poison',
  ground: 'bg-poke-ground',
  flying: 'bg-poke-flying',
  psychic: 'bg-poke-psychic',
  bug: 'bg-poke-bug',
  rock: 'bg-poke-rock',
  ghost: 'bg-poke-ghost',
  dragon: 'bg-poke-dragon',
  dark: 'bg-poke-dark',
  steel: 'bg-poke-steel',
  fairy: 'bg-poke-fairy',
}

/** Light tint of each type's color, used for card/section backgrounds. */
export const TYPE_TINTS: Record<PokemonType, string> = {
  normal: 'bg-poke-normal/15',
  fire: 'bg-poke-fire/15',
  water: 'bg-poke-water/15',
  electric: 'bg-poke-electric/15',
  grass: 'bg-poke-grass/15',
  ice: 'bg-poke-ice/15',
  fighting: 'bg-poke-fighting/15',
  poison: 'bg-poke-poison/15',
  ground: 'bg-poke-ground/15',
  flying: 'bg-poke-flying/15',
  psychic: 'bg-poke-psychic/15',
  bug: 'bg-poke-bug/15',
  rock: 'bg-poke-rock/15',
  ghost: 'bg-poke-ghost/15',
  dragon: 'bg-poke-dragon/15',
  dark: 'bg-poke-dark/15',
  steel: 'bg-poke-steel/15',
  fairy: 'bg-poke-fairy/15',
}

export const TYPE_LABELS_PT: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  electric: 'Elétrico',
  grass: 'Grama',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terrestre',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Noturno',
  steel: 'Metal',
  fairy: 'Fada',
}

export const TYPE_ICONS: Record<PokemonType, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🌪️',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨',
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade',
}

const ROMAN_NUMERALS: Record<string, string> = {
  i: 'I',
  ii: 'II',
  iii: 'III',
  iv: 'IV',
  v: 'V',
  vi: 'VI',
  vii: 'VII',
  viii: 'VIII',
  ix: 'IX',
}

/** Formats a PokeAPI generation resource name, e.g. `generation-iii` -> `Geração III`. */
export function formatGeneration(name: string): string {
  const suffix = name.replace('generation-', '')
  return `Geração ${ROMAN_NUMERALS[suffix] ?? suffix.toUpperCase()}`
}

/** Flattens an evolution chain tree into the list of species names it contains. */
export function flattenEvolutionChain(link: EvolutionChainLink): string[] {
  return [link.species.name, ...link.evolves_to.flatMap(flattenEvolutionChain)]
}

/** Short PT-BR label for how a pokémon reaches the next evolution stage. */
export function describeEvolution(details: EvolutionDetail[]): string {
  const detail = details[0]
  if (!detail) return 'Evolução'
  if (detail.min_level != null) return `Nível ${detail.min_level}`
  if (detail.item) return `Use ${formatPokemonName(detail.item.name)}`
  if (detail.trigger?.name === 'trade') return 'Troca'
  return 'Evolução'
}

/** PokeAPI gender_rate is eighths-female (0-8), or -1 for genderless. */
export function genderRatio(genderRate: number): { male: number; female: number } | null {
  if (genderRate < 0) return null
  const female = (genderRate / 8) * 100
  return { male: 100 - female, female }
}

export function speciesGenus(species: { genera: Array<{ genus: string; language: { name: string } }> }): string | null {
  return (
    species.genera.find((g) => g.language.name === 'pt-BR' || g.language.name === 'pt')?.genus ??
    species.genera.find((g) => g.language.name === 'en')?.genus ??
    null
  )
}

/** Union of types this pokémon takes 2x+ damage from, across all of its own types. */
export function computeWeaknesses(ownTypes: string[], typeResponses: TypeResponse[]): string[] {
  const weaknesses = new Set<string>()
  for (const type of typeResponses) {
    for (const entry of type.damage_relations.double_damage_from) {
      weaknesses.add(entry.name)
    }
  }
  for (const own of ownTypes) weaknesses.delete(own)
  return [...weaknesses]
}

export function bestSprite(sprites: {
  front_default: string | null
  other?: {
    'official-artwork'?: { front_default: string | null }
    home?: { front_default: string | null }
  }
}): string | null {
  return (
    sprites.other?.['official-artwork']?.front_default ??
    sprites.other?.home?.front_default ??
    sprites.front_default
  )
}

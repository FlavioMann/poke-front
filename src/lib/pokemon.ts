import type { EvolutionChainLink, PokemonType } from '@/types/pokeapi'

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

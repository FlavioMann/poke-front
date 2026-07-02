export interface NamedApiResource {
  name: string
  url: string
}

export interface NamedApiResourceList {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]

export interface PokemonTypeSlot {
  slot: number
  type: NamedApiResource
}

export interface PokemonAbilitySlot {
  is_hidden: boolean
  slot: number
  ability: NamedApiResource
}

export interface PokemonStatSlot {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
    }
    home?: {
      front_default: string | null
    }
  }
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  stats: PokemonStatSlot[]
  species: NamedApiResource
}

export interface PokemonSpecies {
  id: number
  name: string
  generation: NamedApiResource
  evolution_chain: { url: string }
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedApiResource
    version: NamedApiResource
  }>
  genera: Array<{
    genus: string
    language: NamedApiResource
  }>
  gender_rate: number
  color: NamedApiResource
}

export interface EvolutionDetail {
  min_level: number | null
  trigger: NamedApiResource | null
  item: NamedApiResource | null
}

export interface EvolutionChainLink {
  species: NamedApiResource
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionChainResponse {
  id: number
  chain: EvolutionChainLink
}

export interface TypeResponse {
  id: number
  name: string
  pokemon: Array<{
    pokemon: NamedApiResource
    slot: number
  }>
  damage_relations: {
    double_damage_from: NamedApiResource[]
  }
}

export interface GenerationResponse {
  id: number
  name: string
  pokemon_species: NamedApiResource[]
}

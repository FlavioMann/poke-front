import type {
  EvolutionChainResponse,
  GenerationResponse,
  NamedApiResourceList,
  PokemonDetail,
  PokemonSpecies,
  TypeResponse,
} from '@/types/pokeapi'

const BASE_URL = 'https://pokeapi.co/api/v2'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`PokeAPI request failed (${response.status}): ${url}`)
  }
  return (await response.json()) as T
}

/** Fetches the full index of pokémon (name + url) in a single request. */
export function getAllPokemon(): Promise<NamedApiResourceList> {
  return fetchJson<NamedApiResourceList>(
    `${BASE_URL}/pokemon?limit=100000&offset=0`,
  )
}

export function getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(`${BASE_URL}/pokemon/${nameOrId}`)
}

export function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return fetchJson<PokemonSpecies>(`${BASE_URL}/pokemon-species/${nameOrId}`)
}

export function getEvolutionChain(url: string): Promise<EvolutionChainResponse> {
  return fetchJson<EvolutionChainResponse>(url)
}

export function getPokemonByType(type: string): Promise<TypeResponse> {
  return fetchJson<TypeResponse>(`${BASE_URL}/type/${type}`)
}

export function getPokemonByGeneration(id: number | string): Promise<GenerationResponse> {
  return fetchJson<GenerationResponse>(`${BASE_URL}/generation/${id}`)
}

export function getAllGenerations(): Promise<NamedApiResourceList> {
  return fetchJson<NamedApiResourceList>(`${BASE_URL}/generation?limit=50`)
}

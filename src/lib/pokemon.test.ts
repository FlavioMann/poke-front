import { describe, expect, it } from 'vitest'
import {
  flattenEvolutionChain,
  formatGeneration,
  formatPokemonName,
  heightToMeters,
  idFromUrl,
  weightToKilograms,
} from '@/lib/pokemon'
import type { EvolutionChainLink } from '@/types/pokeapi'

describe('idFromUrl', () => {
  it('extracts the trailing id from a PokeAPI resource url', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(idFromUrl('https://pokeapi.co/api/v2/generation/3/')).toBe(3)
  })

  it('throws for urls without a trailing numeric id', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow()
  })
})

describe('formatPokemonName', () => {
  it('capitalizes each hyphen-separated part', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr Mime')
    expect(formatPokemonName('pikachu')).toBe('Pikachu')
  })
})

describe('formatGeneration', () => {
  it('maps generation slugs to roman-numeral labels', () => {
    expect(formatGeneration('generation-i')).toBe('Geração I')
    expect(formatGeneration('generation-iii')).toBe('Geração III')
  })
})

describe('unit conversions', () => {
  it('converts decimetres to metres and hectograms to kilograms', () => {
    expect(heightToMeters(7)).toBe(0.7)
    expect(weightToKilograms(69)).toBe(6.9)
  })
})

describe('flattenEvolutionChain', () => {
  it('flattens a linear chain in order', () => {
    const chain: EvolutionChainLink = {
      species: { name: 'bulbasaur', url: '' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'ivysaur', url: '' },
          evolution_details: [],
          evolves_to: [
            { species: { name: 'venusaur', url: '' }, evolution_details: [], evolves_to: [] },
          ],
        },
      ],
    }

    expect(flattenEvolutionChain(chain)).toEqual(['bulbasaur', 'ivysaur', 'venusaur'])
  })

  it('flattens a branching chain (e.g. Eevee), visiting every branch', () => {
    const chain: EvolutionChainLink = {
      species: { name: 'eevee', url: '' },
      evolution_details: [],
      evolves_to: [
        { species: { name: 'vaporeon', url: '' }, evolution_details: [], evolves_to: [] },
        { species: { name: 'jolteon', url: '' }, evolution_details: [], evolves_to: [] },
        { species: { name: 'flareon', url: '' }, evolution_details: [], evolves_to: [] },
      ],
    }

    expect(flattenEvolutionChain(chain)).toEqual(['eevee', 'vaporeon', 'jolteon', 'flareon'])
  })
})

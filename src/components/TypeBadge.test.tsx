import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TypeBadge } from '@/components/TypeBadge'

describe('TypeBadge', () => {
  it('renders the Portuguese type name', () => {
    render(<TypeBadge type="fire" />)
    expect(screen.getByText(/Fogo/)).toBeInTheDocument()
  })

  it('applies the matching background color class for a known type', () => {
    render(<TypeBadge type="water" />)
    expect(screen.getByText(/Água/)).toHaveClass('bg-poke-water')
  })

  it('falls back to a neutral color for an unknown type', () => {
    render(<TypeBadge type="???" />)
    expect(screen.getByText('???')).toHaveClass('bg-neutral-400')
  })
})

import { NavLink } from 'react-router-dom'
import { PokeballIcon } from '@/components/PokeballIcon'

const LINKS = [
  { to: '/', label: 'Pokédex' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/comparar', label: 'Comparar' },
]

function linkClass({ isActive }: { isActive: boolean }): string {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-brand-600' : 'text-white/90 hover:bg-white/10'
  }`
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 hidden bg-brand-500 shadow sm:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <PokeballIcon className="h-6 w-6" /> Pokédex
        </NavLink>

        <nav className="flex gap-1">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

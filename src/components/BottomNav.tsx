import { NavLink } from 'react-router-dom'
import { PokeballIcon } from '@/components/PokeballIcon'

const TABS = [
  { to: '/', label: 'Pokédex', icon: <PokeballIcon className="h-6 w-6" /> },
  { to: '/favoritos', label: 'Favoritos', icon: <HeartIcon /> },
  { to: '/comparar', label: 'Comparar', icon: <CompareIcon /> },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold ${
              isActive ? 'text-brand-600' : 'text-neutral-400'
            }`
          }
        >
          {tab.icon}
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth={2} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6.716-4.35-9.428-8.06C.6 10.24 1.04 6.5 4.05 4.99c2.29-1.15 4.86-.4 6.24 1.4l1.71 2.24 1.71-2.24c1.38-1.8 3.95-2.55 6.24-1.4 3.01 1.51 3.45 5.25 1.48 7.95C18.716 16.65 12 21 12 21z"
      />
    </svg>
  )
}

function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v14M7 17l-3-3M7 17l3-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21V7M17 7l-3 3M17 7l3 3" />
    </svg>
  )
}

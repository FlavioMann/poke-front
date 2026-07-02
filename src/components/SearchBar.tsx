interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar pokémon pelo nome...' }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 stroke-neutral-400"
        fill="none"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" strokeLinecap="round" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar pokémon"
        className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}

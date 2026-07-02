interface PokeballIconProps {
  className?: string
}

export function PokeballIcon({ className = 'h-6 w-6' }: PokeballIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M2 12a10 10 0 0 1 20 0z" fill="#ef4444" />
      <path d="M2 12a10 10 0 0 0 20 0z" fill="#fff" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="#111827" strokeWidth="1.4" />
      <rect x="2" y="11.2" width="20" height="1.6" fill="#111827" />
      <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="#111827" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.2" fill="#fff" stroke="#111827" strokeWidth="0.8" />
    </svg>
  )
}

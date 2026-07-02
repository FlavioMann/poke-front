const MAX_STAT = 255

interface StatBarProps {
  label: string
  value: number
  compareValue?: number
  colorClass?: string
}

export function StatBar({ label, value, compareValue, colorClass = 'bg-brand-500' }: StatBarProps) {
  const pct = Math.min(100, (value / MAX_STAT) * 100)
  const isHigher = compareValue != null && value > compareValue
  const isLower = compareValue != null && value < compareValue

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-neutral-500">{label}</span>
      <span
        className={`w-10 shrink-0 text-right font-semibold ${
          isHigher ? 'text-green-600' : isLower ? 'text-red-500' : 'text-neutral-700'
        }`}
      >
        {value}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${colorClass} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

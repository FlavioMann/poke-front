export function PokemonCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-neutral-100 p-3">
      <div className="min-w-0 flex-1 py-1">
        <div className="h-3 w-10 rounded bg-neutral-200" />
        <div className="mt-2 h-5 w-24 rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-16 rounded-full bg-neutral-200" />
      </div>
      <div className="h-24 w-24 shrink-0 rounded-2xl bg-neutral-200" />
    </div>
  )
}
